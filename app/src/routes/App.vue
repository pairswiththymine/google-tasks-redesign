<template>
  <div id="app">
    <Header />
    <router-view></router-view>
  </div>
</template>

<script>
import Header from "../components/Header.vue"

export default {
  name: 'app',
  components: {
    Header
  },
  data() { return {
    prop: "hecl",
    num: 0
  }},
  created() {
    console.log(this)
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

</style>
