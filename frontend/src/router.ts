import { createRouter, createWebHistory } from 'vue-router'
import MangaList from './views/MangaList.vue'
const routes = [ 
    {
        path: "/",
        component: MangaList,
        alias: '/mangas'
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})