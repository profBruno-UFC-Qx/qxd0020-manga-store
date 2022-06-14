import { defineStore } from 'pinia'
import { api } from '../baseConfig'

interface Manga {
    id: number,
    title: string,
    cover: {
     url: string
    },
    number: number
    price: number
}

interface State {
    mangas: Manga[],
}

export const mangaStore = defineStore('manga', {
    state: (): State => ({
        mangas: [],

    }),
    getters: {
        numberOfMangas: (state) => state.mangas.length
    },
    actions : {
        async getMangas() {
            try {
                const { data } = await api.get('/mangas', {
                    params: {
                        populate: "cover",
                        "pagination[limit]": 100
                    }
                })
                this.mangas = data.data
            } catch(error) {
                console.log(error)
            }
        },
        async getManga(id: number) {
            try {
                const { data } = await api.get(`/mangas/${id}`, {
                    params: {
                        populate: ["cover", "comentarios"],
                    }
                })
                return data.data
            } catch(error) {
                console.log(error)
                return null
            }
        }
    }
})