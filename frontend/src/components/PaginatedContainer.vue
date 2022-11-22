<script setup lang="ts">
import Pagination from './Pagination.vue'

defineProps< {
    page: number,
    pageCount: number,
    total: number,
}>()

</script>

<template>
 <Pagination
   :page="page"
   :page-count="pageCount"
   :total="total"
  ></Pagination>

  <slot></slot>

  <Pagination
   :page="page"
   :page-count="pageCount"
   :total="total"
  ></Pagination>
</template>