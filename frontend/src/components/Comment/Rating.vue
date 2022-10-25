<script setup lang="ts">
defineProps<{
  value: number
}>()
</script>

<template>
  <template v-for="grade in 5">
      <i class="bi bi-star-fill text-warning" v-if="grade <= value"></i>
      <i class="bi bi-star text-warning" v-else></i>
  </template>
</template>