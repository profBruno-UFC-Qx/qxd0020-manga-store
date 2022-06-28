import { AxiosRequestHeaders } from "axios"

export const authenticationHeader = (token: string): AxiosRequestHeaders => { 
    return { "Authorization": `Bearer ${token}` }
}