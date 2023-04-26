<script setup lang="ts">
defineProps<{
  loading: Boolean
}>()
</script>

<template>
  <div class="text-center" v-if="loading">
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <slot v-else></slot>
</template>