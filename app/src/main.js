import Vue from 'vue'
import VueRouter from "vue-router"

import Container from "./Container.vue"
import Landing from "./routes/Landing.vue"
import App from "./routes/App.vue"

import "./api.js"

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: '/', component: Landing },
    { path: '/app', component: App }
  ]
})

const app = new Vue({
  router,
  render: h => h(Container),
})

window.handleGoogleApiLoaded = () => {
  app.$mount('#app')
}