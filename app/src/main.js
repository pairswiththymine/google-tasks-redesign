import Vue from 'vue'
import VueRouter from "vue-router"

import App from "./routes/App.vue"
import Dog from "./routes/Dog.vue"

import "./api.js"

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: '/dog', component: Dog }
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
