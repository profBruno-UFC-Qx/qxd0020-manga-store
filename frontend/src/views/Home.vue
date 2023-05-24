<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useMangaCollection } from '../composables/mangaCollection'
import MangaCard from '../components/MangaCard.vue'
import PaginatedContainer from '../components/PaginatedContainer.vue'
import LoadingContainer from '../components/LoadingContainer.vue'


const { loading, mangaCollection, errorMessage, refresh} = useMangaCollection()

const route = useRoute()
if (route.query.page) refresh(Number(route.query.page))

const mangas = computed(() => mangaCollection.value.items)
const pagination = computed(() => mangaCollection.value.pagination)

onBeforeRouteUpdate((to, from) => {
  if (to.query.page !== from.query.page) { 
    refresh(to.query.page ? Number(to.query.page): 1)
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