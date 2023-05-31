<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Manga } from '../../types'
import { imgURL } from '../../mixin/mangaMixing'
import { isApplicationError } from '../../mixin/errorMessageMixing'
import { useMangaService } from '../../api/MangaService'

const props = defineProps<{
  id?: string
}>()

const mangaService = useMangaService()
const manga = ref<Manga>({} as Manga)
const cover = ref<File>()
const router = useRouter()

const alertVisible = ref(false)
const alertMessage = ref('')
const alertFeedback = ref(false)

onBeforeMount(async () => {
  if (props.id) {
    const result = await mangaService.get(Number(props.id))
    if (isApplicationError(result)) {
      alertMessage.value = result.message
    } else {
      manga.value = result
    }
  }
})

async function update() {
  const { title, number, price } = manga.value
  const result = await mangaService.update(manga.value.id, {
    title,
    number,
    price,
    cover: cover.value
  })
  if (isApplicationError(result)) {
    showNegativeAlert(result.message)
  } else {
    manga.value = await mangaService.get(Number(props.id)) as Manga
    showPositiveAlert("Manga atualizado com sucesso.")
  }

}

function handleFileUpload(event: Event) {
  const inputEvent = event as InputEvent
  const target = inputEvent.target as HTMLInputElement
  cover.value = target.files?.item(0) as File
}

async function create() {
  const { title, number, price } = manga.value
  if (cover.value) {
    const result = await mangaService.create({
      title,
      number,
      price,
      cover: cover.value
    })

    if (isApplicationError(result)) {
      showNegativeAlert("O manga não foi criado.")
    } else {
      showPositiveAlert("Manga criado com sucesso.")
      manga.value = result
      router.push({ path: '/admin', hash: `#${manga.value.id}` })
    }

  } else {
    showNegativeAlert("A capa do mangá é obrigatório.")
  }


}

function showPositiveAlert(message: string) {
  showAlert(true, message)
}

function showNegativeAlert(message: string) {
  showAlert(false, message)
}

function showAlert(positive: boolean, message: string) {
  alertFeedback.value = positive
  alertMessage.value = message
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
    <div class="col-12 alert alert-dismissible fade show"
      :class="{ 'd-none': !alertVisible, 'alert-success': alertFeedback, 'alert-danger': !alertFeedback }" role="alert">
      {{ alertMessage }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    <img class="col-auto" v-if="manga.cover" :src="imgURL(manga.cover.url)" />
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