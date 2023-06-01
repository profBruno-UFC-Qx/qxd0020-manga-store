import axios from 'axios'
import { ApplicationError } from '../types'

class AppError {

  static isAppError(error: any): error is ApplicationError {
    return error.name !== undefined && error.message !== undefined
  }
  static retrive<T>(error: any, transform?: (error: any) => ApplicationError ): ApplicationError {
    if (axios.isAxiosError<T>(error)) {
      if (error.response && transform) {
        return transform(error.response.data)
      } else {
        return { name: error.name, message: error.message }
      }
    }
    throw error
  }

}

export const useErrorUtil = () => AppError