<template>
  <div class="date-picker">
    <div class="card">
      <header>
        <button v-on:click="modMonth(-1)"><img src="../assets/left-arrow.svg"></button>
        <p>{{ new Date(activeYear, activeMonth).toLocaleString('en-us', { month: 'long' }) + " " + activeYear }}</p>
        <button v-on:click="modMonth(1)"><img src="../assets/right-arrow.svg"></button>
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
          <span 
            v-for="(day, i) in days" 
            v-bind:key="i"
            v-bind:class="'date ' + 
              ((day.date === selected.getDate() && activeYear === selected.getFullYear() && activeMonth === selected.getMonth()) ? 'selected ' : '') + 
              ((day.date === defaultDate.getDate() && activeYear === defaultDate.getFullYear() && activeMonth === defaultDate.getMonth()) ? 'original' : '')"
            v-on:click="setSelected(day.date)"
          >
            <p>{{ day.date }}</p>
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
import Vue from "vue"

export default {
  data: () => ({
    activeMonth: 1,
    activeYear: 2019,
    days: [],
    selected: null
  }),
  props: {
    defaultDate: Date
  },
  methods: {
    createDays() {
      this.days = []
      const lastDay = new Date(2019, this.activeMonth + 1, 0)
      for(let i = 0; i < lastDay.getDate(); i++) {
        this.days.push({
          date: i + 1,
        })
      }
    },
    
    modMonth(i) {
      this.activeMonth += i
      if(this.activeMonth > 11) {
        this.activeYear++
        this.activeMonth = 0
      }
      if(this.activeMonth < 0) {
        this.activeYear--
        this.activeMonth = 11
      }
    },

    setSelected(day) {
      this.selected = new Date(this.activeYear, this.activeMonth, day)
    }
  },

  watch: {
    activeMonth() {
      this.createDays()
    }
  },
  created() {
    this.activeMonth = this.defaultDate.getMonth()
    this.activeYear = this.defaultDate.getFullYear()
    this.selected = this.defaultDate
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
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 2px 12px;
      p {
        margin: 0;
      }
      button {
        background: transparent;
        border-radius: 50%;
        outline: none;
        border: none;
        cursor: pointer;
        position: relative;
        height: 32px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          height: 0;
          width: 0;
          opacity: 0;
          border-radius: 50%;
          background-color: rgba($alt-background, 0.6);
          transition: all ease-in-out 0.2s
        }
        img {
          position: relative;
          z-index: 1;
        }
        &:hover::after {
          opacity: 1;
          top: -2px;
          left: -2px;
          height: 36px;
          width: 36px;
        }
      }
    }
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
        width: calc(100% / 7);
        margin-bottom: 4px;
        height: 32px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        p {
          position: relative;
          z-index: 1;
          width: 100%;
          text-align: center;
        }
        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: calc(50% - 16px);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          z-index: 0;
        }
      }
      .dates>span {
        cursor: pointer;
        &.original {
          color: $main;
          &::after {
            background-color: rgba($main, 0.3);
          }
        }
        &.selected {
          color: rgba(#fff, 0.85);
          &::after {
            background-color: $main;
          }
        }
      }
      .names>span {
        color: $alt-color;
        font-weight: 500;
        font-size: 13px;
      }
    }
  }
}
</style>
