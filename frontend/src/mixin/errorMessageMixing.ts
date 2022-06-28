import axios, { AxiosRequestHeaders } from 'axios'

export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
       return `${error.response?.status} - ${error.response?.data.error.message}`
    } else if( error instanceof Error) {
        return error.message
    }
    return String(error)
}