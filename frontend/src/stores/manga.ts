import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '../baseConfig'
import { useUserStore } from '../stores/user'
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

export const useMangaStore = defineStore('manga', () => {
    const mangas = ref<Manga[]>([])
    const pagination = ref<Pagination>({
        page: 0,
        pageCount: 0,
        pageSize: 0,
        total: 0
    })

    function previousManga(manga: Manga) {
        const currentIndex = mangas.value.findIndex(m => m.id === manga.id)
        return currentIndex > 0 ? mangas.value[currentIndex - 1].id : manga.id
    }
    
    function nextManga(manga: Manga) {
        const currentIndex = mangas.value.findIndex(m => m.id === manga.id)
        return currentIndex < mangas.value.length - 1 ? mangas.value[currentIndex + 1].id : manga.id
    }

    async function all(page: number = 1) {
        try {
            const { data } = await api.get('/mangas', {
                params: {
                    populate: "cover",
                    "pagination[pageSize]": 24,
                    "pagination[page]": page
                }
            })
            mangas.value = data.data
            pagination.value = data.meta.pagination
        } catch(error) {
            console.log(getErrorMessage(error))
            return false
        }
    }
        
    async function get(id: number) {
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
    }

    async function create(manga: FormData) {
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
            console.log(getErrorMessage(error))
            return undefined
        }
    }
        
    async function remove(id: number) {
        try {
            const store = useUserStore()
            const { data } = await api.delete(`/mangas/${id}`, {
                headers: authenticationHeader(store.token)
            })
            const mangaDeleted = mangas.value.find( manga => manga.id === id)
            if (mangaDeleted) {
                mangas.value.splice(mangas.value.indexOf(mangaDeleted), 1)
            }
            return data.data
        } catch(error) {
            console.log(getErrorMessage(error))
            return false
        }
    }
    
    async function update(manga: Manga, newCover?: FormData) {
        const { id } = manga
        try {
            const store = useUserStore()
            const { data } = await api.put(`/mangas/${id}`, newCover, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...authenticationHeader(store.token)
                }
            })
            const mangaUpdated = await get(id)
            mangas.value = mangas.value.map(m => m.id == mangaUpdated.id ? mangaUpdated : m )
            return mangaUpdated
        } catch(error) {
            console.log(getErrorMessage(error))
            return undefined
        }
    }
    
    return { mangas, pagination, previousManga, nextManga, all, create, get, remove, update}
})