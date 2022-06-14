import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MangaExpandedCard from '../views/MangaExpandedCard.vue'
import NotFound from '../views/NotFound.vue'
const routes = [ 
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