import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminHome from '../views/admin/Home.vue'
import MangaForm from '../views/admin/MangaForm.vue'
import Home from '../views/Home.vue'
import MangaExpandedCard from '../views/MangaInDetails.vue'
import Error from '../views/error/Error.vue'

const routes = [
    {
        path: "/login",
        component: Login,
        name: 'login'
    },
    {
        path: "/admin",
        component: AdminHome,
        name: "adminHome",
        meta: { requiresAdmin: true}
    },
    {
        path: "/admin/manga/",
        component: MangaForm,
        name: 'addManga',
        meta: { requiresAdmin: true}
    }, 
    {
        path: "/admin/manga/:id",
        component: MangaForm,
        name: 'editManga',
        props: true,
        meta: { requiresAdmin: true}
    }, 
    {
        path: "/",
        component: Home,
        name: "home",
        alias: '/mangas'
    }, 
    {
        path: '/mangas/:id',
        component: MangaExpandedCard,
        name: 'verManga',
    },
    {
        path: '/error',
        component: Error,
        name: 'error',
        props: true
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})