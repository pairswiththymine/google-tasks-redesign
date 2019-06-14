<template>
  <div id="app">
    <Header />
    <p v-on:click="num += 4">hello world {{ num }}</p>
  </div>
</template>

<script>
import Header from "./components/Header.vue"

export default {
  name: 'app',
  components: {
    Header
  },
  data: () => ({
    prop: "hecl",
    num: 0
  }),
  created() {
    console.log(this.$data.prop)
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
