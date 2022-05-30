import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { axios } from './stores/manga'
import { router } from './router'

const app = createApp(App)

app.config.globalProperties.axios = axios

axios.interceptors.response.use(null, error => {
    if(error.response.status === 404) {
        router.replace({
            name: 'notFound',
            params: { msg: error.response.data.msg}
        })
    }
})

app.use(createPinia())
app.use(router)
app.mount('#app')
