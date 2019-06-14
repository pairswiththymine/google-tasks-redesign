<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  data() { return {
    prop: "hecl",
    num: 0
  }},
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

</style>
