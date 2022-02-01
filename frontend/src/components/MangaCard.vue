<script setup lang="ts">
import { computed, getCurrentInstance } from "vue"
import { imgAlt, imgURL} from '../mixin/mangaMixing'

const axios = getCurrentInstance().appContext.config.globalProperties.axios

const props = defineProps<{
    id: number,
    cover: URL
    title: string,
    volumeNumber: number,
    summary: string,
    price: number
}>()


</script>
<template>
    <div class="col">
        <router-link :to="`/mangas/${this.id}`" class="text-decoration-none text-reset">
            <div class="card shadow-sm">
                <img :src="imgURL(axios, this.cover)" class="card-img-top" :alt="imgAlt(this.volumeNumber, this.title)">

                <div class="card-body">
                    <h5 class="card-title">{{this.volumeNumber}} - {{this.title}}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Preço: {{this.price}}</h6>
                    <p class="card-text">{{this.summary}}</p>
                    <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">9 mins</small>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>