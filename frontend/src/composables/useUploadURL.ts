import { baseURL } from '../baseConfig';

function getUploadURL(url: string) {
  return `${baseURL}${url}`
}

export const useUploadFile = (url: string) => getUploadURL(url)