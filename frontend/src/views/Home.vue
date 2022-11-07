<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useMangaStore } from '../stores/manga'
import MangaCard from '../components/MangaCard.vue'
import PaginatedContainer from '../components/PaginatedContainer.vue'

const mangaStore = useMangaStore()
const mangas = computed(() => mangaStore.mangas)
const pagination = computed(() => mangaStore.pagination)

onBeforeMount(async () => mangaStore.all())

onBeforeRouteUpdate( async (to, from) => {
    if (to.query.page !== from.query.page) { 
      await mangaStore.all(Number(to.query.page))
    } 
})

</script>

<template>
  <PaginatedContainer
   :page="pagination.page"
   :page-count="pagination.pageCount"
   :page-size="pagination?.pageSize"
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
</template>