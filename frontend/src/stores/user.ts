import { defineStore } from 'pinia'
import { AxiosRequestHeaders } from 'axios'
import { api } from '../baseConfig'
import { getErrorMessage } from '../mixin/errorMessageMixing'

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

const authenticationHeader = (token: string): AxiosRequestHeaders => { 
    return { "Authorization": `Bearer ${token}` }
}

export const userStore = defineStore('user', {
    state: (): State => ({
        user: {} as User
    }),
    getters: {
        role(state) {
            return state.user.role
        },
        isAuthenticated(state) {
            return state.user.jwt !== undefined
        },
        isAdmin(state) {
            return state.user.role === "admin"
        },
        username(state) {
            return state.user.username
        }
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
                  role: await this.getRoles()
                }
                return true
            } catch(error) {
                console.log(getErrorMessage(error))
            }
            return false
        },
        async getRoles() {
            if(this.user.jwt) {
                try {
                    const { data } = await api.get('users/me', {
                        headers: authenticationHeader(this.user.jwt),
                        params: {
                            populate: 'roles'
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
        logout() {
            this.user = {} as User
        }
    }
})