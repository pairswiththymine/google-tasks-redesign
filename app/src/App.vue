<template>
  <router-view></router-view>
</template>

<script>
import api from "./api.js"

export default {
  name: 'App',
  mounted() {
    document.addEventListener("DOMContentLoaded", e => {
      api.init()
    })
  }
}
</script>

<style lang="scss">
@import "./_style.scss";

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

::selection {
  background-color: $main;
  color: rgba(#fff, 0.95);
}
</style>
