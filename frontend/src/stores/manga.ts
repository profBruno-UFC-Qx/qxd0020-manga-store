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
        lastMangaId(state) {
            return state.mangas.length === 0 ? 0 : state.mangas[state.mangas.length - 1].id
        },
        firstMangaId(state) {
            return state.mangas.length === 0 ? 0 : state.mangas[0].id
        }
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
        async get(id: number) {
            try {
                const { data } = await api.get(`/mangas/${id}`, {
                    params: {
                        populate: ["cover", "comments"],
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