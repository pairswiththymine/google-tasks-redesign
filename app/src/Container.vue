<template><div>
  <div v-bind:class="`content-container ${ ready ? 'ready' : '' }`">
    <router-view v-if="ready"></router-view>
  </div>
  <div v-bind:class="`loading-container ${ ready ? 'faded' : '' }`">
    <div class="img">
      <img src="./assets/logo-tasks.svg">
    </div>
  </div>
</div></template>

<script>
import api from "./api.js"

export default {
  name: 'Container',
  data: () => ({
    ready: false
  }),
  created() {
    const animationDuration = 2 * 1000 * 0.3 // double the duration of the animation converted to ms
    const startTime = new Date().getTime()
    api.init().then(() => {
      if(new Date().getTime() - startTime < animationDuration) {
        setTimeout(() => {
          this.ready = true
        }, animationDuration - (new Date().getTime() - startTime))
      } else this.ready = true
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

<style lang="scss" scoped>
@import "./_style.scss";

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0
  }

  50% {
    transform: scale(2.5);
    opacity: 1
  }

  100% {
    transform: scale(2);
    opacity: 1
  }
}

@keyframes pulse-ripple {
  0% {
    transform: scale(0);
    opacity: 0
  }
  13% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  100% {
    transform: scale(10);
    opacity: 0
  }
}

$fade-time: 0.3s;
$pulse-time: 0.3s;

.loading-container {
  height: 100vh;
  width: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity ease-in-out $fade-time;
  &.faded {
    opacity: 0;
    pointer-events: none;
  }
  .img {
    position: relative;
    img {
      animation: pulse $pulse-time cubic-bezier(0.4, 0, 0.2, 1) forwards;
      z-index: 1;
      position: relative;
      opacity: 0;
    }
    &::after {
      content: "";
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      border-radius: 100%;
      position: absolute;
      background: rgba($alt-background, 0.6);
      opacity: 0;
      animation: pulse-ripple #{$pulse-time * 2} ease-in-out forwards;
    }
  }
}

.content-container {
  opacity: 0;
  transition: opacity ease-in-out $fade-time;
  &.ready { 
    opacity: 1;
  }
}
</style>
