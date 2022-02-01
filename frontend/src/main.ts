import { createApp } from 'vue'
import App from './App.vue'
import { store, axios } from './store'

const app = createApp(App)

app.config.globalProperties.axios = axios

app.use(store)
app.mount('#app')
