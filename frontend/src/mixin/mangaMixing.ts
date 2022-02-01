import { AxiosInstance } from "axios";

export const imgAlt = function(volume: number, title: string) {
    return `${volume}-${title}`
} 

export const imgURL = function(axios: AxiosInstance, coverURL: URL) {
    return `${axios.defaults.baseURL}${coverURL}`    
}
