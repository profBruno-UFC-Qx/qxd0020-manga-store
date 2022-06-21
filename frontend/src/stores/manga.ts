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
                console.log(error)
                return null
            }
        },
        async update(manga: Manga) {
            const { id, title, number, price} = manga
            try {
                const { data } = await api.put(`/mangas/${id}`, {
                    data: {
                        title: title,
                        number:number,
                        price: price
                    }
                })
                const mangaToUpdate = this.mangas.find( manga => manga.id === id)
                if(mangaToUpdate) {
                    mangaToUpdate.title = title
                    mangaToUpdate.number = number
                    mangaToUpdate.price = price
                }
                return true
            } catch(error) {
                console.log(error)
                return false
            }
        }
    }
})