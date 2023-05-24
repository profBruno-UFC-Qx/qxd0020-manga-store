import { AxiosRequestHeaders } from "axios"

export const bearerAuthorization = (token: string): AxiosRequestHeaders => { 
    return { "Authorization": `Bearer ${token}` }
}