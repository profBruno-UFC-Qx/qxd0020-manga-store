import axios from 'axios'

export interface ApplicationError {
  name: string,
  message: string,
  details?: string,
}

export function getAppError(error: unknown): ApplicationError {
    if (axios.isAxiosError(error)) {
      if(error.response) {
        const requestError = error.response.data.error
        const { name, message, details } = requestError 
        return { name, message, details}
      } else {
        return { name: error.name, message: error.message}
      }
    } 
    throw error
}