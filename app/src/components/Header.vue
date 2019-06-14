<template>
  <header>
    <a href="#">
      <img src="../assets/tasks_64dp.png" alt="">
      <span>Tasks</span>
    </a>
  </header>
</template>

<script>
export default {
  name: "Header",
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

  >a {
    margin-left: 16px;
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
