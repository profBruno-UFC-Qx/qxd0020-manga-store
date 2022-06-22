<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { mangaStore } from '../../stores/manga'
import { imgURL } from '../../mixin/mangaMixing'

const props = defineProps<{
    id?: string
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
const cover = ref<File>({} as File)

const alertVisible = ref(false)
const alertMessage = ref('')
const alertFeedback = ref(false)

onBeforeMount( async () => {
    if(props.id) {
        manga.value = await store.get(Number(props.id))
    }
})

async function update() {
    const result = await store.update(manga.value) 
    showAlert(result, "Manga atualizado com sucesso.", "O manga não foi atualizado.")
}

function handleFileUpload(event: Event) {
    const inputEvent = event as InputEvent
    const target = inputEvent.target as HTMLInputElement
    cover.value = target.files?.item(0) as File
}

async function create() {
    const formDataManga = new FormData()
    if(cover.value.name) {
        formDataManga.append('files.cover', cover.value, cover.value.name)
    }
    formDataManga.append('data', JSON.stringify({
        title: manga.value.title,
        number: manga.value.number,
        price: manga.value.price
    }))

    const result = await store.create(formDataManga)
    showAlert(result !== undefined, "Manga criado com sucesso.", "O manga não foi criado.") 
    if (result){
        manga.value = result
    }
}

function showAlert(success: boolean, successMsg: string, errorMessage: string) {
if (success) {
        alertMessage.value = successMsg
        alertFeedback.value = true
    } else {
        alertMessage.value = errorMessage
        alertFeedback.value = false
    }
    alertVisible.value = true
}

</script>

<template>
    <div class="text-center" v-if="!manga.id && props.id">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <template v-else>
        <div class="col-12 alert alert-dismissible fade show" :class="{ 'd-none': !alertVisible, 'alert-success': alertFeedback, 'alert-danger': !alertFeedback }" role="alert">
            {{ alertMessage }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <img class="col-auto" v-if="manga.cover" :src="imgURL(manga.cover.url)"/>
        <div class="row text-start">
            <div class="col-12 mb-3">
                <label for="coverInput" class="form-label">Manga cover</label>
                <input type="file" id="coverInput" accept="image/*" @change="handleFileUpload" class="form-control">
            </div>
            <div class="col-12 mb-3">
                <label for="titleInput" class="form-label">Manga title</label>
                <input type="text" id="titleInput" class="form-control" v-model="manga.title" placeholder="an awesome title">
            </div>
             <div class="col-3 mb-3 ">
                <label for="numberInput" class="form-label">Manga number</label>
                <input type="number" id="numberInput" class="form-control" v-model="manga.number" placeholder="volume number">
            </div>
            <div class="col-2 mb-3">
                <label for="priceInput" class="form-label">Manga price</label>
                <input type="text" id="priceInput" class="form-control" v-model="manga.price" placeholder="00.00">
            </div>
        </div>
        <router-link to="/admin" class="btn btn-danger">Cancel</router-link> 
        <a class="btn btn-primary" v-if="manga.id" @click="update">Update</a>
        <a class="btn btn-success" v-else @click="create">Create</a>
    </template>
</template>