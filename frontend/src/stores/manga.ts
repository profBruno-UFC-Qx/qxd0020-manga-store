import { defineStore } from 'pinia'
import Axios from 'axios'

interface Manga {
    title: string,
    cover: string,
    volumeNumber: number,
    price: number
}

interface State {
    mangas: Manga[],
    manga: Manga | null

}

export const mangaStore = defineStore('manga', {
    state: (): State => ({
        mangas: [],
        manga: null
    }),
    getters: {
        numberOfMangas: (state) => state.mangas.length
    },
    actions : {
        async getMangas() {
            try {
                const response = await axios.get('/mangas')
                this.mangas = response.data
            } catch(error) {
                console.log(error)
            }
        },
        async getManga(id: number) {
            try {
                const response = await axios.get(`/mangas/${id}`)
                this.manga = response.data
            } catch(error) {
                console.log(error)
            }
        }
    }
})

export const axios = Axios.create({
    baseURL: 'http://localhost:8080/',
    timeout: 1000,
    headers: {
        Accept: "application/json",
        "Content-type": "application/json"
    }
})