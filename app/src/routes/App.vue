<template>
  <Header />
</template>

<script>
import Header from "../components/Header.vue"
import api from "../api.js"
export default {
  name: "app",
  components: {
    Header
  },
  created() {
    console.log(api.getTaskLists().then(console.log))
    // console.log(api.authed())
    if(!api.authed()) this.$router.push("/")
  }
}
</script>

<style lang="scss" scoped>

</style>
