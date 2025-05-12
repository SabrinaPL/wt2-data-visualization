import { createApp } from "vue";
import { createPinia } from "pinia";
import '@shoelace-style/shoelace/dist/shoelace.js';
import App from "./App.vue";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);

app.mount("#app");
