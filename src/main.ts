import { createApp } from 'vue'
import 'normalize.css'
// import './style.css'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './routers/index.js'
import store from './store/index'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
