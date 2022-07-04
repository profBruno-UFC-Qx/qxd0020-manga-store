<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { mangaStore } from '../stores/manga'
import { imgURL } from '../mixin/mangaMixing'

interface Comments {
    id: string,
    description: string,
    rating: number
}

interface Manga {
    id: string,
    title: string,
    cover: {
        url: string,
        alternativeText: string
    },
    comments: Comments[],
    number: number
    price: number
}

const store = mangaStore()
const nextManga = computed(() => store.nextManga(manga.value))
const previousManga = computed(() => store.previousManga(manga.value))

const route = useRoute()
const id = route.params.id as string
const manga = ref<Manga>({} as Manga)  

onBeforeMount(async () => {
    manga.value = await store.get(id)
})


onBeforeRouteUpdate( async (to, from) => {
    if (to.params.id !== from.params.id) {
        manga.value = await store.get(to.params.id as string)
    } 
})

</script>

<template>
    <div class="text-center" v-if="!manga.id">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div class="row align-items-center" v-else>
        <div class="col-md-2">
            <router-link :to="{ name: 'verManga', params: { id: previousManga }}">
                <button type="button" class="btn btn-lg btn-outline-secondary" :disabled="manga.id === previousManga">
                    <i class="bi bi-arrow-left-square-fill"></i>
                </button>
            </router-link>
        </div>
        <div class="col">
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img :src="imgURL(manga.cover.url)" class="w-100 rounded-start" :alt="manga.cover.alternativeText">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">{{manga.title}}</h5>
                            <hr>
                            <div class="text-start">
                                <p class="card-text">Volume: {{manga.number}}</p>
                                <p class="card-text"><strong>Preço: <small class="text-danger">{{manga.price}}</small></strong></p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="col-md-2">
            <router-link :to="{ name: 'verManga', params: { id: nextManga }}">
                <button type="button" class="btn btn-lg btn-outline-secondary" :disabled="manga.id === nextManga">
                    <i class="bi bi-arrow-right-square-fill"></i>
                </button>
            </router-link>
        </div>
        <div class="row">
            <div class="col-12">
                <h4>Avaliações</h4>
                <hr>
                <template v-if="manga?.comments.length">
                    <div class="card m-4 text-start" v-for="comentario in manga?.comments">
                        <div class="card-body">
                            <h6 class="card-subtitle">
                                <template v-for="nota in 5">
                                    <i class="bi bi-star-fill text-warning" v-if="nota <= comentario.rating"></i>
                                    <i class="bi bi-star text-warning" v-else></i>
                                </template>
                            </h6>
                            <p class="card-text">
                                {{comentario.description}}
                            </p>
                        </div>
                    </div>    
                </template>
                <section v-else>
                    Nenhum comentário feito até o momento
                </section>   
            </div> 
        </div>
    </div>
</template>