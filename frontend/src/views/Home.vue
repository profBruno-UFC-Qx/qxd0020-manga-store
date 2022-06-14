<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { mangaStore } from '../stores/manga'
import MangaCard from '../components/MangaCard.vue'

const store = mangaStore()
const mangas = computed(() => store.mangas)

onBeforeMount(async () => store.getMangas())

</script>

<template>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        <MangaCard v-for="manga in mangas" :key="manga.id"
        :id="manga.id"
        :title="manga.title"
        :cover="manga.cover.url"
        :number="manga.number"
        :price="manga.price">
        </MangaCard>
  </div>
</template>