<script setup lang="ts">
import Pagination from './Pagination.vue'

interface Pagination {
    page: number,
    pageSize: number,
    pageCount: number,
    total: number,
}
defineProps<Pagination>()

</script>

<template>
 <Pagination
   :page="page"
   :page-count="pageCount"
   :page-size="pageSize"
   :total="total"
  ></Pagination>

  <slot></slot>

  <Pagination
   :page="page"
   :page-count="pageCount"
   :page-size="pageSize"
   :total="total"
  ></Pagination>
</template>