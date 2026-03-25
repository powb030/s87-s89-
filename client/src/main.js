import './assets/main.css'                                    

import { createPinia } from "pinia";                      
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import 'bootswatch/dist/sketchy/bootstrap.min.css'       
import 'bootstrap/dist/js/bootstrap.bundle.min.js'           
import 'notyf/notyf.min.css'                                

const app = createApp(App);
app.use(createPinia());  
app.use(router);         
app.mount("#app");        