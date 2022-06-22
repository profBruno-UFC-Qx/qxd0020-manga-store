import { defineStore } from 'pinia'
import { api } from '../baseConfig'
import axios, { AxiosError} from 'axios'

interface Manga {
    id: number,
    title: string,
    cover: {
     url: string,
     alternativeText: string
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
                console.log(`${error.status} - ${error.data.error.message}`)
                return false
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
                console.log(`${error.status} - ${error.data.error.message}`)
                return false
            }
        },
        async create(manga: FormData) {
            try {
                const { data } = await api.post(`/mangas/`, manga, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                await this.getMangas()
                return this.mangas.find(m => m.id === data.data.id)
            } catch(error) {
                console.log(`${error.status} - ${error.data.error.message}`)
                return undefined
            }
        },
        async delete(id: number) {
            try {
                const { data } = await api.delete(`/mangas/${id}`)
                const mangaDeleted = this.mangas.find( manga => manga.id === id)
                if (mangaDeleted) {
                    this.mangas.splice(this.mangas.indexOf(mangaDeleted), 1)
                }
                return data.data
            } catch(error) {
                console.log(`${error.status} - ${error.data.error.message}`)
                return false
            }
        },
        async update(manga: Manga, newCover?: FormData) {
            const { id, title, number, price} = manga
            try {
                const { data } = await api.put(`/mangas/${id}`, newCover, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                await this.getMangas()
                return this.mangas.find(m => m.id === data.data.id)
            } catch(error) {
                console.log(`${error.status} - ${error.data.error.message}`)
                return undefined
            }
        }
    }
})