<template>
  <header v-bind:class="shadow ? 'shadowed' : ''">
    <button v-on:click="$emit('toggle-menu')">
      <img src="../assets/menu.svg" alt="menu">
    </button>
    <a href="#">
      <img src="../assets/tasks_64dp.png" alt="">
      <span>Tasks</span>
    </a>
  </header>
</template>

<script>
export default {
  name: "Header",
  data: () => ({
    shadow: false
  }),
  mounted() {
    const that = this
    document.addEventListener("scroll", e => {
      if(window.scrollY < 40) that.shadow = false
      else that.shadow = true
    })
  }
}
</script>

<style lang="scss" scoped>
@import "../_style.scss";

header {
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 100;
  width: 100%;
  border-bottom: 1px solid $alt-background;
  display: flex;
  align-items: center;
  font-family: $main-font;
  transition: 0.1s box-shadow ease-in-out;
  box-shadow: none;
  &.shadowed {
    box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2);
  }
  >button {
    margin-left: 24px;
    background-color: transparent;
    border: none;
    outline: none;
    height: 48px;
    width: 48px;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &::after {
      content: "";
      top: 50%;
      left: 50%;
      height: 0;
      width: 0;
      background-color: $alt-background;
      position: absolute;
      z-index: -1;
      border-radius: 50%;
      transition: all ease-in-out 0.1s;
    }
    &:hover::after {
      top: 0;
      left: 0;
      padding-top: 100%;
      width: 100%;
    }
  }
  >a {
    margin-left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    img {
      height: 40px;
      width: 40px;
      display: inline-block;
    }
    span {
      top: 1px;
      position: relative;
      font-size: 24px;
      margin-left: 4px;
      color: $alt-color;
    }
  }
}
</style>
