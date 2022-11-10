import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { api } from './baseConfig'
import { router } from './router'
import { useUserStore } from './stores/user'


api.interceptors.response.use(response => response, error => {
    if(error.response && error.response.status !== 400) {
        router.replace({
            name: 'error',
            params: { 
                status: error.response.status,
                msg: error.response.data.error.message 
            }
        })
    } else {
        console.log(error)
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
