<script setup lang="ts">
import { ref, computed, onBeforeMount, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useMangaStore, MangaCollection } from '../../stores/manga'
import { imgURL } from '../../mixin/mangaMixing'
import { isApplicationError } from '../../mixin/errorMessageMixing'
import PaginatedContainer from '../../components/PaginatedContainer.vue'

const mangaStore = useMangaStore()
const mangaCollection = ref<MangaCollection>({} as MangaCollection)
const mangas = computed(() => mangaCollection.value.mangas)
const pagination = computed(() => mangaCollection.value.pagination)
const loading = ref(true)
const errorMessage = ref('')

async function getMangasAndUpdate(page = 1) {
  const result = await mangaStore.all(page)
  if(isApplicationError(result)) {
    errorMessage.value = result.message
  } else {
    mangaCollection.value = result
  }
  loading.value = false 
}

onBeforeMount(async () => getMangasAndUpdate())

onBeforeRouteUpdate(async (to, from) => {
    if (to.query.page !== from.query.page) { 
      getMangasAndUpdate(Number(to.query.page))
    } 
})

onMounted(() => {
  const route = useRoute()
  if(route.hash){
    setTimeout(() => location.href = route.hash, 500)
  }
})

const selectedManga = ref({id: 0, title: ''})


function askConfirmation(id: number, title: string) {
  selectedManga.value = { id: id, title: title}  
}

async function deleteManga() {
  const result = await mangaStore.remove(selectedManga.value.id)
  if (!isApplicationError(result)) {
    mangaCollection.value.mangas = mangaCollection.value.mangas.filter(m => m.id != selectedManga.value.id)
    selectedManga.value = { id: 0, title: ''}  
  }
}


</script>

<template>
  <div class="text-center" v-if="loading">
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <PaginatedContainer v-else
    :page="pagination.page"
    :page-count="pagination.pageCount"
    :page-size="pagination?.pageSize"
    :total="pagination?.total"
  >
    <router-link :to="{ name: 'addManga'}" class="btn btn-success"><i class="bi bi-plus"></i>Add</router-link>
    
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
      <table class="table table-striped">
        <thead>
          <tr>
          <th>#</th>
          <th>Title</th>
          <th>Cover</th>
          <th>Number</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(manga, index) in mangas" :key="manga.id">
            <td><a :id="`${manga.number}`">{{ manga.number }}</a></td>
            <td>{{ manga.title }}</td>
            <td><img :src="imgURL(manga.cover.url)" class="img-thumbnail rounded-3 w-25" alt="..."/></td>
            <td>{{ manga.number }}</td>
            <td>{{ manga.price }}</td>
            <td>
              <a class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#confirmationModal" @click="askConfirmation(manga.id, manga.title)"><i class="bi bi-trash"></i></a> 
              <router-link :to="{ name: 'editManga', params: { id: manga.id}}" class="btn btn-sm btn-primary"><i class="bi bi-pencil"></i></router-link></td>
          </tr>
        </tbody>
      </table>
  </div>
  </PaginatedContainer>
  <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Confirmação</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Você tem certeza que deseja deletar o manga <strong>{{ selectedManga.title }}</strong>?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="deleteManga">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>