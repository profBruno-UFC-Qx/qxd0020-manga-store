<script setup lang="ts">
import { computed } from '@vue/runtime-core'
import { mangaStore } from '../stores/manga'
import MangaCard from '../components/MangaCard.vue'

const store = mangaStore()
const mangas = computed(() => store.mangas)

</script>

<template>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        <MangaCard v-for="manga in mangas" :key="manga.id"
        :id="manga.id"
        :title="manga.title"
        :summary="manga.summary"
        :cover="manga.cover"
        :volumeNumber="manga.volume"
        :price="manga.price">
        </MangaCard>
  </div>
</template>