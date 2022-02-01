import { createRouter, createWebHistory } from 'vue-router'
import MangaList from './views/MangaList.vue'
import MangaExpandedCard from './views/MangaExpandedCard.vue'
import NotFound from './views/NotFound.vue'
const routes = [ 
    {
        path: "/",
        component: MangaList,
        alias: '/mangas'
    }, 
    {
        path: '/mangas/:id',
        component: MangaExpandedCard,
        name: 'mangaDetails',
        props: true
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