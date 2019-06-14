<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
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
