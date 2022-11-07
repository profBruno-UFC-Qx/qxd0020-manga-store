import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { api } from './baseConfig'
import { router } from './router'
import { useUserStore } from './stores/user'


api.interceptors.response.use(response => response, error => {
    if(error.response.status === 404) {
        router.replace({
            name: 'notFound',
            params: { msg: error.response.data.error.message }
        })
    } else {
        return Promise.reject(error)
    }
})

const app = createApp(App)
app.use(createPinia())

const userStore = useUserStore()

router.beforeEach((to, from) => {
    if(to.meta.requiresAdmin && !userStore.isAdmin) {
        return {
            path: '/login',
            query: { redirect: to.fullPath }
        }
    }
})

app.use(router)
app.mount('#app')
