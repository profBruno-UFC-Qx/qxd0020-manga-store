import { createApp } from 'vue'
import App from './App.vue'
import { store, axios } from './store'
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

app.use(store)
app.use(router)
app.mount('#app')
