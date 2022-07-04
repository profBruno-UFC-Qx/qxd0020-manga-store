import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'
import Cookie from 'js-cookie'
import { api } from '../baseConfig'
import { getErrorMessage } from '../mixin/errorMessageMixing'
import { authenticationHeader } from '../mixin/authenticationMixing'
import { SafeLocalStorageService } from '../mixin/safeLocalStorage'

interface User {
    id: number,
    username: string,
    email: string,
    jwt: string,
    role: string
}

interface State {
    user: User
}

const cookieName = 'xbcAa-vG.HzbSh5.'
const encryptionToken = Cookie.get(cookieName) || uuid()
Cookie.set(cookieName, encryptionToken, { secure: true, expires: 180 })

const safeLocalStorage = new SafeLocalStorageService(window.localStorage, encryptionToken)

export const userStore = defineStore('user', {
    state: (): State => ({
        user: {
            id: Number(safeLocalStorage.getItem('id')),
            username:  safeLocalStorage.getItem('username'),
            email: safeLocalStorage.getItem('email'),
            jwt: safeLocalStorage.getItem('zFJqsz757BscGHsg'),
            role: safeLocalStorage.getItem('role')
        }
    }),
    getters: {
        role(state) {
            return state.user.role || safeLocalStorage.getItem('role')
        },
        username(state) {
            return state.user.username || safeLocalStorage.getItem('username')
        },
        token(state) {
            return state.user.jwt ||  safeLocalStorage.getItem('zFJqsz757BscGHsg')
        },
        isAuthenticated() {
            return this.token !== undefined
        },
        isAdmin() {
            return this.role.toString() === "admin"
        },
    },
    actions : {
        async authenticate(login: string, password: string) {
            try {
                const { data } = await api.post('/auth/local', {
                    identifier: login,
                    password: password
                })
                const { user, jwt } = data
                this.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    jwt: jwt,
                    role: ""
                }
                this.user.role = await this.getRoles()
                this.updateLocalStore()
                return true
            } catch(error) {
                console.log(getErrorMessage(error))
            }
            return false
        },
        async getRoles() {
            if(this.isAuthenticated) {
                try {
                    const { data } = await api.get('/users/me', {
                        headers: authenticationHeader(this.user.jwt),
                        params: {
                            populate: 'role'
                        }
                    })
                    const { role } = data
                    return role.type
                } catch(error) {
                    console.log(getErrorMessage(error))  
                }
            }
            return {}
        },
        updateLocalStore() {
            const { id, username, email, jwt, role } = this.user
            safeLocalStorage.setItem('id', id.toString())
            safeLocalStorage.setItem('username', username)
            safeLocalStorage.setItem('email', email),
            safeLocalStorage.setItem('zFJqsz757BscGHsg', jwt),
            safeLocalStorage.setItem('role', role)
        },
        logout() {
            this.user = {} as User
            safeLocalStorage.clear()
            Cookie.remove(cookieName)
        }
    }
})