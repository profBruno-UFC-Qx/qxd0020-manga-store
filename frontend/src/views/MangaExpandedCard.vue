<script setup lang="ts">
import { computed, getCurrentInstance } from "vue"
import { useStore } from "vuex"
import { useRoute, onBeforeRouteUpdate } from "vue-router"
import { imgAlt, imgURL } from '../mixin/mangaMixing'

const axios = getCurrentInstance().appContext.config.globalProperties.axios

const props = defineProps<{
    id: string,
}>()

const store = useStore()
const route = useRoute()

onBeforeRouteUpdate( (to, from) => {
    if(to.params.id !== from.params.id) {
        store.dispatch('getManga', to.params.id)
    }
})

store.dispatch('getManga', route.params.id)

const manga = computed(() => store.state.manga)

const numberOfMangas = computed(() => store.getters.numberOfMangas)

</script>


<template>
    <div class="row align-items-center" v-if="manga !== null">
        <div class="col-md-2">
            <router-link :to="`/mangas/${Math.max(1, id - 1)}`">
                <button type="button" :class="{disabled: Number(id) === 1}" class="btn btn-lg btn-outline-secondary">
                    <i class="bi bi-arrow-left-square-fill"></i>
                </button>
            </router-link>
        </div>
        <div class="col">
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4">
                    <img :src="imgURL(axios, manga.cover)" class="img-fluid rounded-start" :alt="imgAlt(manga.volumeNumber, manga.title)">
                    </div>
                    <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">{{manga.title}}</h5>
                        <hr>
                        <div class="text-start">
                            <p class="card-text">Volume: {{manga.volumeNumber}}</p>
                            <p class="card-text"><strong>Preço: <small class="text-danger">{{manga.price}}</small></strong></p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <router-link :to="`/mangas/${Math.min(Number(id) + 1, numberOfMangas)}`">
                <button type="button" :class="{disabled: Number(id) === numberOfMangas}" class="btn btn-lg btn-outline-secondary">
                    <i class="bi bi-arrow-right-square-fill"></i>
                </button>
            </router-link>
        </div>
    </div>
</template>