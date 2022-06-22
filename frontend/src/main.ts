import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { api } from './baseConfig'
import { router } from './router'


api.interceptors.response.use(response => response, error => {
    if(error.response.status === 404) {
        router.replace({
            name: 'notFound',
            params: { msg: error.response.data.error.message }
        })
    } else {
        return Promise.reject(error.response)
    }
})


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
