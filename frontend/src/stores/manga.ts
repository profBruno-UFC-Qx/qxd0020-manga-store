import { defineStore } from 'pinia'
import { api } from '../baseConfig'
import { userStore } from '../stores/user'
import { getErrorMessage } from '../mixin/errorMessageMixing'
import { authenticationHeader } from '../mixin/authenticationMixing'

interface Manga {
    id: string,
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
        previousManga(state) {
            return (manga: Manga) => {
                const currentIndex = state.mangas.findIndex(m => m.id === manga.id)
                return currentIndex > 0 ? state.mangas[currentIndex - 1].id : manga.id
            }
        },
        nextManga(state) {
            return (manga: Manga) => {
                const currentIndex = state.mangas.findIndex(m => m.id === manga.id)
                return currentIndex < state.mangas.length - 1 ? state.mangas[currentIndex + 1].id : manga.id
            }
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
                console.log(getErrorMessage(error))
                return false
            }
        },
        async get(id: string) {
            try {
                const { data } = await api.get(`/mangas/${id}`, {
                    params: {
                        populate: ["cover", "comments"],
                    }
                })
                return data.data
            } catch(error) {
                console.log(getErrorMessage(error))
                return false
            }
        },
        async create(manga: FormData) {
            try {
                const store = userStore()
                const { data } = await api.post(`/mangas/`, manga, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...authenticationHeader(store.token)
                    }
                })
                return data.data
            } catch(error) {
                console.log(getErrorMessage(error))
                return undefined
            }
        },
        async delete(id: string) {
            try {
                const store = userStore()
                const { data } = await api.delete(`/mangas/${id}`, {
                    headers: authenticationHeader(store.token)
                })
                const mangaDeleted = this.mangas.find( manga => manga.id === id)
                if (mangaDeleted) {
                    this.mangas.splice(this.mangas.indexOf(mangaDeleted), 1)
                }
                return data.data
            } catch(error) {
                console.log(getErrorMessage(error))
                return false
            }
        },
        async update(id: string, newCover?: FormData) {
            try {
                const store = userStore()
                const { data } = await api.put(`/mangas/${id}`, newCover, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...authenticationHeader(store.token)
                    }
                })
                await this.getMangas()
                return this.mangas.find(m => m.id === data.data.id)
            } catch(error) {
                console.log(getErrorMessage(error))
                return undefined
            }
        }
    }
})