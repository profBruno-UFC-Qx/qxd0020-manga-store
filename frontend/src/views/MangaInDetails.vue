<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { Manga } from '../types'
import { imgURL } from '../mixin/mangaMixing'
import { useErrorUtil } from '../composables/useApplicationError'
import { useMangaService } from '../api/MangaService'
import CommentsContainer from '../components/Comment/Container.vue'
import LoadingContainer from '../components/LoadingContainer.vue'

const mangaService = useMangaService()

const route = useRoute()
const id = Number(route.params.id)
const manga = ref<Manga>({} as Manga)
const loading = ref(true)
const errorMessage = ref('')

async function getMangaAndUpdate(id: number) {
  const result = await mangaService.get(id)
  if (useErrorUtil().isAppError(result)) {
    errorMessage.value = result.message
  } else {
    manga.value = result
  }
  loading.value = false
}


getMangaAndUpdate(id)



onBeforeRouteUpdate(async (to, from) => {
  if (to.params.id !== from.params.id) {
    getMangaAndUpdate(id)
  }
})

</script>

<template>
  <LoadingContainer :loading="manga.id == undefined">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-sm-12">
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <img :src="imgURL(manga.cover.url)" class="w-100 rounded-start" :alt="manga.cover.alternativeText">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">{{ manga.title }}</h5>
                <hr>
                <div class="text-start">
                  <p class="card-text">Volume: {{ manga.number }}</p>
                  <p class="card-text"><strong>Preço: <small class="text-danger">{{ manga.price }}</small></strong></p>
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
  </LoadingContainer>
</template>