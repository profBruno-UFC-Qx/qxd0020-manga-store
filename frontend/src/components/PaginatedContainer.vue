<script setup lang="ts">
import Pagination from './Pagination.vue'

interface Pagination {
    page: number,
    pageSize: number,
    pageCount: number,
    total: number,
}
const props = defineProps<Pagination>()

</script>

<template>
 <Pagination
   :page="props.page"
   :page-count="props.pageCount"
   :page-size="props.pageSize"
   :total="props.total"
  ></Pagination>

  <slot></slot>

  <Pagination
   :page="props.page"
   :page-count="props.pageCount"
   :page-size="props.pageSize"
   :total="props.total"
  ></Pagination>
</template>