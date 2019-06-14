<template>
  <div class="landing">
    <h1>Google Tasks Desktop</h1>
    <div class="cta">
      <button class="auth">Go to application</button>
      <a href="https://github.com/alexa-griffin/google-tasks-redesign">See the source</a>
    </div>
    <img src="../assets/dude.svg" alt="">
    <p class="disclaimer">This product is not made, or endorsed by Google.</p>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped lang="scss">
@import "../style.scss";

.landing {
  height: 100vh;
  width: 95%;
  max-width: 960px;
  margin: 0 auto;
  font-family: $main-font;
  overflow: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  h1 {
    font-size: 3rem;
    margin-bottom: 2rem;
  }
  .cta {
    display: flex;
    align-items: center;
    .auth {
      outline: none;
      border: none;
      font-size: 1.3rem;
      padding: 8px 16px;
      border-radius: 8px;
      font-family: $main-font;
      background-color: transparent;
      cursor: pointer;
      border: 1px solid $alt-background;
      color: $main;
      transition: all ease-in-out 0.1s;
      &:hover {
        background-color: rgba($main, 0.1);
        border: 1px solid $main;
      }
    }
    a {
      margin-left: 1rem;
      text-decoration: none;
      color: inherit;
      font-size: 1.1rem;
      border-radius: 8px;
      padding: 6px;
      &:hover {
        background-color: $alt-background;
      }
    }
  }
  .disclaimer {
    position: absolute;
    bottom: 16px;
    left: 0;
    width: 100%;
    text-align: center;
  }
}
</style>
