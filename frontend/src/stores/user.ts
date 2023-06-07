import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'
import Cookie from 'js-cookie'
import { api } from '../baseConfig'
import { User, ApplicationError  } from '../types'
import { useBearerAuthorization } from '../composables/useBearerHeader'
import { useErrorUtil } from '../composables/useApplicationError'
import { SafeLocalStorageService } from '../mixin/safeLocalStorage'


const cookieName = 'xbcAa-vG.HzbSh5.'
const encryptionToken = Cookie.get(cookieName) || uuid()
Cookie.set(cookieName, encryptionToken, { secure: true, expires: 180 })

const safeLocalStorage = new SafeLocalStorageService(window.localStorage, encryptionToken)

export const useUserStore = defineStore('user', () => {
    const user = ref<User>({
        id: Number(safeLocalStorage.getItem('id')),
        username:  safeLocalStorage.getItem('username'),
        email: safeLocalStorage.getItem('email'),
        jwt: safeLocalStorage.getItem('zFJqsz757BscGHsg'),
        role: safeLocalStorage.getItem('role')
    })

    const role = computed(() => user.value.role || safeLocalStorage.getItem('role'))
    const username = computed(() => user.value.username || safeLocalStorage.getItem('username'))
    const token = computed(() => user.value.jwt || safeLocalStorage.getItem('zFJqsz757BscGHsg'))
    const isAuthenticated = computed(() => token.value !== undefined)
    const isAdmin = computed(() => role.value.toString() === "admin")
    
    async function authenticate(login: string, password: string): Promise<true | ApplicationError> {
        try {
            const { data } = await api.post<{jwt: string} & {user: Omit<User, "jwt">}>('/auth/local', {
                identifier: login,
                password: password
            })
            user.value = { ...data.user, jwt: data.jwt}
            user.value.role = await getRoles()
            updateLocalStore()
            return true
        } catch(error) {
            const appError = useErrorUtil().retrive(error)
            if(appError.name === "ValidationError") {
                appError.message = "Usuário ou senha incorretos!"
            }
            return appError
        }
    }
    
    async function getRoles() {
        const { data } = await api.get('/users/me', {
            headers: useBearerAuthorization(user.value.jwt),
            params: {
                populate: ["role"],
            }
        })
        return data.role.type
    }

    function updateLocalStore() {
        const { id, username, email, jwt, role } = user.value
        safeLocalStorage.setItem('id', `${id}`)
        safeLocalStorage.setItem('username', username)
        safeLocalStorage.setItem('email', email),
        safeLocalStorage.setItem('zFJqsz757BscGHsg', jwt),
        safeLocalStorage.setItem('role', role)
    }

    function logout() {
        user.value = {} as User
        safeLocalStorage.clear()
        Cookie.remove(cookieName)
    }

    return {user, role, username, token, isAuthenticated, isAdmin, authenticate, logout}
})