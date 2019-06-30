<template>
  <div class="date-picker">
    <div class="card">
      <header>
         <button></button>
        <p>{{ new Date(activeYear, activeMonth).toLocaleString('en-us', { month: 'long' }) }}</p>
        <button></button>
      </header>
      <main>
        <div class="names">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>
        <div class="dates">
          <div v-bind:style="'width: calc(100% / 7 * ' + new Date(activeYear, activeMonth).getDay() + ')'"></div>
          <span v-for="(day, i) in days" v-bind:key="i" class="date">
            {{ day.date }}
          </span>
        </div>
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
    activeYear: 2019,
    days: []
  }),

  methods: {
    createDays() {
      this.days = []
      const lastDay = new Date(2019, this.activeMonth + 1, 0)
      for(let i = 0; i < lastDay.getDate(); i++) {
        this.days.push({
          date: i + 1
        })
      }
    }
  },

  watch: {
    activeMonth() {
      this.createDays()
    }
  },
  created() {
    this.createDays()
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
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
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
    padding: 8px;
    max-width: 300px;
    position: relative;
    padding-bottom: 64px;
    footer {
      bottom: 0;
      left: 0;
      width: 100%;
      position: absolute;
      text-align: right;
      padding: 8px;
      height: 64px;
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
    main {
      div.dates {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
      span {
        font-size: 12px;
        height: 32px;
        width: calc(100% / 7);
        margin-bottom: 4px;
        text-align: center;
        border-radius: 50%;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .names>span {
        color: $alt-color;
        font-weight: 500;
      }
    }
  }
}
</style>
