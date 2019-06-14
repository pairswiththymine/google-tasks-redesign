import Vue from 'vue'
import VueRouter from "vue-router"

import App from "./App.vue"
import Landing from "./routes/Landing.vue"

import "./api.js"

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: '/', component: Landing }
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
