<template>
  <router-view v-if="ready"></router-view>
  <div v-else>loading</div>
</template>

<script>
import api from "./api.js"

export default {
  name: 'Container',
  data: () => ({
    ready: false
  }),
  created() {
    api.init().then(() => {
      this.ready = true
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
