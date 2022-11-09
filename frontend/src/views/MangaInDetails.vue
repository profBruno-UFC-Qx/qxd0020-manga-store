<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useMangaStore } from '../stores/manga'
import { imgURL } from '../mixin/mangaMixing'
import CommentsContainer from '../components/Comment/Container.vue'

interface Comments {
    id: number,
    description: string,
    rating: number
}

interface Manga {
    id: number,
    title: string,
    cover: {
        url: string,
        alternativeText: string
    },
    comments: Comments[],
    number: number
    price: number
}

const mangaStore = useMangaStore()

const route = useRoute()
const id = route.params.id
const manga = ref<Manga>({} as Manga)  

onBeforeMount( async () => {
    manga.value = await mangaStore.get(Number(id))
})


onBeforeRouteUpdate( async (to, from) => {
    if (to.params.id !== from.params.id) {
        manga.value = await mangaStore.get(Number(to.params.id))
    } 
})

</script>

<template>
    <div class="text-center" v-if="!manga.id">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div class="row justify-content-center" v-else>
        <div class="col-lg-8 col-sm-12">
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

        <div class="row">
            <CommentsContainer class="col-12" :comments="manga.comments"></CommentsContainer>
        </div>
    </div>
</template>