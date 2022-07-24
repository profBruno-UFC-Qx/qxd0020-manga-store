<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { mangaStore } from '../stores/manga'
import MangaCard from '../components/MangaCard.vue'
import Pagination from '../components/Pagination.vue'

const store = mangaStore()
const mangas = computed(() => store.mangas)
const pagination = computed(() => store.pagination)

onBeforeMount(async () => store.getMangas())

onBeforeRouteUpdate( async (to, from) => {
    if (to.query.page !== from.query.page) { 
      await store.getMangas(Number(to.query.page))
    } 
})

</script>

<template>
  <Pagination
   :page="pagination.page"
   :page-count="pagination.pageCount"
   :page-size="pagination?.pageSize"
   :total="pagination?.total"
  ></Pagination>
  <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        <MangaCard v-for="manga in mangas" :key="manga.id"
        :id="manga.id"
        :title="manga.title"
        :cover="manga.cover.url"
        :number="manga.number"
        :price="manga.price"></MangaCard>
  </div>
  <Pagination
   :page="pagination.page"
   :page-count="pagination.pageCount"
   :page-size="pagination?.pageSize"
   :total="pagination?.total"
  ></Pagination>
</template>