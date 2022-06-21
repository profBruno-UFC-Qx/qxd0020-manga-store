<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { mangaStore } from '../../stores/manga'
import { imgURL } from '../../mixin/mangaMixing'

const props = defineProps<{
    id: string
}>()

interface Manga {
    id: number,
    title: string,
    cover: {
        url: string,
        alternativeText: string
    },
    number: number
    price: number
}

const store = mangaStore()
const manga = ref<Manga>({} as Manga)

const alertVisible = ref(false)
const alertMessage = ref('')
const alertFeedback = ref(false)

onBeforeMount( async () => {
    manga.value = await store.get(Number(props.id))
})

async function update() {
    const result = await store.update(manga.value) 
    if (result) {
        alertMessage.value = "Manga atualizado com sucesso"
        alertFeedback.value = true
    } else {
        alertMessage.value = "O manga não foi atualizado."
        alertFeedback.value = false
    }
    alertVisible.value = true
}

</script>

<template>
    <div class="text-center" v-if="!manga.id">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <template v-else>
        <div class="col-12 alert alert-dismissible fade show" :class="{ 'd-none': !alertVisible, 'alert-success': alertFeedback, 'alert-danger': !alertFeedback }" role="alert">
            {{ alertMessage }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <img class="col-auto" :src="imgURL(manga.cover.url)"/>
        <div class="row text-start">
            <div class="col-12 mb-3">
                <label for="exampleFormControlInput1" class="form-label">Manga title</label>
                <input type="text" class="form-control" v-model="manga.title" placeholder="name@example.com">
            </div>
             <div class="col-3 mb-3 ">
                <label for="exampleFormControlInput1" class="form-label">Manga number</label>
                <input type="number" class="form-control" v-model="manga.number" placeholder="name@example.com">
            </div>
            <div class="col-2 mb-3">
                <label for="exampleFormControlInput1" class="form-label">Manga price</label>
                <input type="text" class="form-control" v-model="manga.price" placeholder="name@example.com">
            </div>
        </div>
        <router-link to="/admin" class="btn btn-danger">Cancel</router-link> <a class="btn btn-primary" @click="update">Update</a>
    </template>
</template>