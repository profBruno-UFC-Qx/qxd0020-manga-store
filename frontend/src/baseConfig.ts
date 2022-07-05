import Axios from 'axios'

export const baseURL = 'http://localhost:8080'

export const api = Axios.create({
    baseURL: `${baseURL}/api/`,
    timeout: 1000,
    //headers: {'X-Custom-Header': 'foobar'}
});