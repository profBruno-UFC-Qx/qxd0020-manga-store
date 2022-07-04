<script setup lang="ts">
import { imgURL} from '../mixin/mangaMixing'

const props = defineProps<{
    id: string,
    cover: string
    title: string,
    number: number,
    price: number
}>()


</script>
<template>
    <div class="col">
        <router-link :to="`/mangas/${id}`" class="text-decoration-none text-reset">
            <div class="card shadow-sm">
                <img :src="imgURL(cover)" class="card-img-top" alt="...">

                <div class="card-body text-center">
                    <h5 class="card-title">{{number}} - {{title}}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Preço: {{price}}</h6>
                    <div class="d-flex justify-content-between align-items-center">
                    <!--<small class="text-muted">9 mins</small>-->
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>