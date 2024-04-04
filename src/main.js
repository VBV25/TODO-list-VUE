import store from './store';
import { createApp } from 'vue'
import router from './router';
import App from './App.vue'
import components from '@/components/UI'

const app = createApp(App)

components.forEach(component => {
  app.component(component.name, component)
});

app.use(router)
app.use(store)

app.mount('#app')