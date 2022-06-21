import { createRouter, createWebHistory } from 'vue-router'
import AdminHome from '../views/admin/Home.vue'
import MangaForm from '../views/admin/MangaForm.vue'
import Home from '../views/Home.vue'
import MangaExpandedCard from '../views/MangaInDetails.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
    {
        path: "/admin",
        component: AdminHome,
    },
    {
        path: "/admin/manga/:id",
        component: MangaForm,
        name: 'editManga',
        props: true
    }, 
    {
        path: "/",
        component: Home,
        alias: '/mangas'
    }, 
    {
        path: '/mangas/:id',
        component: MangaExpandedCard,
        name: 'verManga',
    },
    {
        path: '/404',
        component: NotFound,
        name: 'notFound',
        props: true
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})