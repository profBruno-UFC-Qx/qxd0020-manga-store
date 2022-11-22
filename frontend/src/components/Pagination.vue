<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps<{
    page: number,
    pageCount: number,
    total: number,
}>()

const route = useRoute()
const url = route.name?.toString()

</script>

<template>

<nav aria-label="Page navigation">
  <ul class="pagination justify-content-center">
    
    <li class="page-item">
      <router-link class="page-link" aria-label="Previous" :class="{disabled: page == 1}" :to="{ name: url, query: { page: page -1 }}">
        <span aria-hidden="true">&laquo;</span>
      </router-link>
    </li>

    <li class="page-item" v-for="pageNumber in pageCount" :key="pageNumber">
      <router-link
        class="page-link" 
        :class="{ active: page == pageNumber}" 
        :to="{ name: url, query: { page: pageNumber }}">{{ pageNumber }}
      </router-link>
    </li>

    <li class="page-item">
      <router-link class="page-link" aria-label="Next" :class="{disabled: page == pageCount}" :to="{ name: url, query: { page: page + 1 }}">
        <span aria-hidden="true">&raquo;</span>
      </router-link>
    </li>
  </ul>
</nav>

</template>