import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '../baseConfig'
import { useUserStore } from '../stores/user'
import { ApplicationError, getAppError } from '../mixin/errorMessageMixing'
import { authenticationHeader } from '../mixin/authenticationMixing'

interface Comments {
    id: number,
    description: string,
    rating: number
}

export interface Manga {
    id: number,
    title: string,
    cover: {
     url: string,
     alternativeText: string
    },
    comments: Comments[],
    number: number
    price: number
}

interface Pagination {
    page: number,
    pageSize: number,
    pageCount: number,
    total: number
}

export type MangaCollection = {
    mangas: Manga[],
    pagination: Pagination
}

export const useMangaStore = defineStore('manga', () => {
    const mangas = ref<Manga[]>([])
    const pagination = ref<Pagination>({
        page: 0,
        pageCount: 0,
        pageSize: 0,
        total: 0
    })

    async function all(page: number = 1): Promise<MangaCollection | ApplicationError> {
        try {
            const { data } = await api.get('/mangas', {
                params: {
                    populate: "cover",
                    "pagination[pageSize]": 24,
                    "pagination[page]": page
                }
            })
            return { mangas: data.data,  pagination: data.meta.pagination}
        } catch(error) {
            return getAppError(error)
        }
    }
        
    async function get(id: number): Promise<Manga | ApplicationError> {
        try {
            const { data } = await api.get(`/mangas/${id}`, {
                params: {
                    populate: ["cover", "comments"],
                }
            })
            return data.data
        } catch(error) {
            return getAppError(error)
        }
    }

    async function create(manga: FormData): Promise<Manga | ApplicationError> {
        try {
            const store = useUserStore()
            const { data } = await api.post(`/mangas/`, manga, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...authenticationHeader(store.token)
                }
            })
            return data.data
        } catch(error) {
            return getAppError(error)
            
        }
    }
        
    async function remove(id: number): Promise<Manga | ApplicationError> {
        try {
            const store = useUserStore()
            console.log(store.token)
            const { data } = await api.delete(`/mangas/${id}`, {
                headers: authenticationHeader(store.token)
            })
            const mangaDeleted = mangas.value.find( manga => manga.id === id)
            if (mangaDeleted) {
                mangas.value.splice(mangas.value.indexOf(mangaDeleted), 1)
            }
            return data.data
        } catch(error) {
           return getAppError(error)
        }
    }
    
    async function update(manga: Manga, newCover?: FormData): Promise<Manga | ApplicationError> {
        const { id } = manga
        try {
            const store = useUserStore()
            const { data } = await api.put(`/mangas/${id}`, newCover, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...authenticationHeader(store.token)
                }
            })
            return get(id)
        } catch(error) {
            return getAppError(error)
        }
    }
    
    return { mangas, pagination, all, create, get, remove, update }
})