<template>
  <div class="date-picker">
    <div class="card">
      <header>{{ new Date(0, activeMonth).toLocaleString('en-us', { month: 'long' }) }}</header>
      <main>
        <span v-for="(day, i) in days" v-bind:key="i">
          {{ day.date }}
        </span>
      </main>
      <footer>
        <button>Cancel</button>
        <button>OK</button>
      </footer>
    </div>
    <div class="overlay"></div>
  </div>
</template>

<script>
export default {
  data: () => ({
    activeMonth: 1,
    days: []
  }),

  watch: {
    activeMonth() {
      this.days = []
      const lastDay = new Date(2019, this.activeMonth + 1, 0)
      for(let i = 0; i < lastDay.getDate(); i++) {
        this.days.push({
          date: i + 1
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../_style.scss";

.date-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000000;
  font-family: $main-font;
  .overlay {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .card {
    background-color: #fff;
    z-index: 100;
    border-radius: 8px;
    box-shadow: 0 12px 15px 0 rgba(0,0,0,0.24);
    width: 95%;
    max-width: 300px;
    height: 200px;
    position: relative;
    footer {
      bottom: 0;
      left: 0;
      width: 100%;
      position: absolute;
      text-align: right;
      padding: 8px;
      button {
        border-radius: 2px;
        background-color: transparent;
        border: none;
        outline: none;
        padding: 8px;
        cursor: pointer;
        font-weight: 500;
        font-size: 1rem;
        letter-spacing: 0.05rem;
        margin-right: 24px;
        margin-bottom: 8px;
        &:last-child {
          color: $main;
        }
      }
    }
  }
}
</style>
