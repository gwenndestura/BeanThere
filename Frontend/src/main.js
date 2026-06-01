import './assets/main.css'; 
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import authPlugin from './plugins/auth.js';

const app = createApp(App);
app.use(createPinia())
app.use(router);
app.mount('#app');
app.use(authPlugin);