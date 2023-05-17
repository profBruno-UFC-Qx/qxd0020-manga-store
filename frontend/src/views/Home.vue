<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { Collection } from '../repositories/BaseRepository'
import { Manga } from '../models/Manga'
import { useMangaService } from '../repositories/MangaRepository'
import { isApplicationError } from '../mixin/errorMessageMixing'
import MangaCard from '../components/MangaCard.vue'
import PaginatedContainer from '../components/PaginatedContainer.vue'
import LoadingContainer from '../components/LoadingContainer.vue'

const mangaStore = useMangaService()
const mangaCollection = ref<Collection<Manga>>({} as Collection<Manga>)
const mangas = computed(() => mangaCollection.value.items)
const pagination = computed(() => mangaCollection.value.pagination)
const loading = ref(true)
const errorMessage = ref('')
const route = useRoute()

async function getMangasAndUpdate(page = 1) {
  const result = await mangaStore.all({pagination: {page}})
  if(isApplicationError(result)) {
    errorMessage.value = result.message
  } else {
    mangaCollection.value = result
  }
  loading.value = false 
}


onBeforeMount(async () => {
  const page = route.query.page ? Number(route.query.page): 1
  getMangasAndUpdate(page)
})

onBeforeRouteUpdate(async (to, from) => {
  if (to.query.page !== from.query.page) { 
    getMangasAndUpdate(to.query.page ? Number(to.query.page): 1)
  } 
})

</script>

<template>
  <LoadingContainer :loading="loading">
    <PaginatedContainer
     :page="pagination.page"
     :page-count="pagination.pageCount"
     :total="pagination?.total"
    >
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        <MangaCard v-for="manga in mangas" :key="manga.id"
        :id="manga.id"
        :title="manga.title"
        :cover="manga.cover.url"
        :number="manga.number"
        :price="manga.price"></MangaCard>
      </div>
    </PaginatedContainer>
  </LoadingContainer>
</template>