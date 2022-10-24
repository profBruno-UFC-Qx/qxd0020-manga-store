import { defineStore } from 'pinia'
import { api } from '../baseConfig'
import { userStore } from '../stores/user'
import { getErrorMessage } from '../mixin/errorMessageMixing'
import { authenticationHeader } from '../mixin/authenticationMixing'

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

interface Pagination {
    page: number,
    pageSize: number,
    pageCount: number,
    total: number
}

interface State {
    mangas: Manga[],
    pagination: Pagination
}



export const mangaStore = defineStore('manga', {
    state: (): State => ({
        mangas: [],
        pagination: {
            page: 0,
            pageCount: 0,
            pageSize: 0,
            total: 0
        }
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
        async getMangas(page: number = 1) {
            try {
                const { data } = await api.get('/mangas', {
                    params: {
                        populate: "cover",
                        "pagination[pageSize]": 24,
                        "pagination[page]": page
                    }
                })
                this.mangas = data.data
                this.pagination = data.meta.pagination
            } catch(error) {
                console.log(getErrorMessage(error))
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
        async delete(id: number) {
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
        async update(manga: Manga, newCover?: FormData) {
            const { id } = manga
            try {
                const store = userStore()
                const { data } = await api.put(`/mangas/${id}`, newCover, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...authenticationHeader(store.token)
                    }
                })
                const mangaUpdated = await this.get(id)
                this.mangas = this.mangas.map(m => m.id == mangaUpdated.id ? mangaUpdated : m )
                return mangaUpdated
            } catch(error) {
                console.log(getErrorMessage(error))
                return undefined
            }
        }
    }
})