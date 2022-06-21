<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { mangaStore } from '../../stores/manga'
import { imgURL} from '../../mixin/mangaMixing'

const store = mangaStore()
const mangas = computed(() => store.mangas)

onBeforeMount(async () => store.getMangas())

const selectedManga = ref({id: 0, title: ''})


function askConfirmation(id: number, title: string) {
  selectedManga.value = { id: id, title: title}  
}

async function deleteManga() {
  if (await store.delete(selectedManga.value.id)) {
    selectedManga.value = { id: 0, title: ''}  
  }
  
}


</script>

<template>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
      <table class="table table-striped">
        <thead>
          <tr>
          <th>Id</th>
          <th>Title</th>
          <th>Cover</th>
          <th>Number</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="manga in mangas" :key="manga.id">
            <td>{{ manga.id }}</td>
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