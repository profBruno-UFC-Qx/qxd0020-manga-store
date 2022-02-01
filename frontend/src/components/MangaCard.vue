<script setup lang="ts">
import { computed, getCurrentInstance } from "@vue/runtime-core"

const axios = getCurrentInstance().appContext.config.globalProperties.axios

const props = defineProps<{
    id: number,
    cover: URL
    title: string,
    volumeNumber: number,
    summary: string,
    price: number
}>()

const imgAlt = computed(() => `${props.volumeNumber} - ${props.title}`)

const imgURL = computed(() => `${axios.defaults.baseURL}${props.cover}`)

</script>
<template>
    <div class="col">
        <div class="card shadow-sm">
            <img :src="imgURL" class="card-img-top" :alt="imgAlt">

            <div class="card-body">
                <h5 class="card-title">{{this.volumeNumber}} - {{this.title}}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Preço: {{this.price}}</h6>
                <p class="card-text">{{this.summary}}</p>
                <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                    <a href="#" class="btn btn-sm btn-outline-secondary">View</a>                    
                </div>
                <small class="text-muted">9 mins</small>
                </div>
            </div>
        </div>
    </div>
</template>