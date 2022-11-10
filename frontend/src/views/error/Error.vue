<script setup lang="ts">
import { computed } from 'vue' 
const props = defineProps<{
    status: string,
    msg: string
}>()

const icon = computed(() => {
    switch(Number(props.status)) {
        case 404:
            return "exclamation-octagon"
        case 403 | 401:
            return "hand-thumbs-down"
        case 500:
            return "tropical-storm"
        default:
            return "info-square"
    }
})
</script>

<template>
    <h1><i :class="'bi bi-' + icon"></i></h1>
    <h1>Ops... Alguma coisa deu errado</h1>
    <h2 v-if="msg != undefined" class="text-muted">{{msg}}</h2>
    
    <router-link to="/mangas" replace>
        <button type="button" class="btn btn-lg btn-outline-secondary">
                    <i class="bi bi-arrow-right-square-fill"></i> Voltar
                </button>
    </router-link>
</template>

<style>
h1, h2 {
    text-align: center;
}
</style>