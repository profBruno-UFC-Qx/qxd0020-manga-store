import { createApp } from 'vue'
import App from './App.vue'
import { store, axios } from './store'
import { router } from './router'

const app = createApp(App)

app.config.globalProperties.axios = axios

app.use(store)
app.use(router)
app.mount('#app')
