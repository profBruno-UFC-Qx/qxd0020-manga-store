import { ref } from 'vue'
import { Manga } from '../types'
import { Collection } from '../adapters/BaseAdapter'
import { useMangaService } from '../api/MangaService'
import { useErrorUtil } from './useApplicationError'

export function useMangaCollection(page = 1) {
 
  const mangaService = useMangaService()
  const mangaCollection = ref<Collection<Manga>>({} as Collection<Manga>)
  const loading = ref(true)
  const errorMessage = ref('')

  const refresh = async function getMangasAndUpdate(page = 1) {
    const result = await mangaService.all({pagination: {page}})
    if(useErrorUtil().isAppError(result)) {
      errorMessage.value = result.message
    } else {
      mangaCollection.value = result
    }
    loading.value = false 
  }
  refresh(page)

  return {loading, mangaCollection, errorMessage, refresh}
}