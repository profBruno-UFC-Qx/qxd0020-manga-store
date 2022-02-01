<script setup lang="ts">

const props = defineProps<{
    msg: string
}>()
</script>

<template>
    <h1>Ops... Alguma coisa deu errado</h1>
    <h2 v-if="msg != undefined" class="text-muted">{{msg}}</h2>
    
    <router-link to="/mangas" replace>
        <button type="button" class="btn btn-lg btn-outline-secondary">
                    <i class="bi bi-arrow-right-square-fill"></i> Voltar
                </button>
    </router-link>
</template>