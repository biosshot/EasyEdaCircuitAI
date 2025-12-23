import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './src/App.vue';
import 'katex/dist/katex.min.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('body');
