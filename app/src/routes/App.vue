<template>
  <div>
    <Header />
    <aside>
      <ul v-if="taskLists">
        <li 
          v-for="taskList in taskLists" 
          v-bind:key="taskList.id" 
          v-bind:class="taskList.id === active ? 'active' : ''"
          v-on:click="active = taskList.id"
        >
          {{ taskList.title }}
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
import Header from "../components/Header.vue"
import api from "../api.js"

export default {
  name: "app",
  components: {
    Header
  },
  data: () => ({
    taskLists: null,
    active: null
  }),
  created() {
    if(!api.authed()) this.$router.push("/")
    else {
      api.getTaskLists().then(res => {
        this.taskLists = res.items
        this.active = res.items[0].id
      }, console.error)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../_style.scss";

aside {
  height: 100vh;
  width: 300px;
  padding-top: 64px;
  position: fixed;
  top: 0;
  left: 0;
  font-family: $main-font;
  ul {
    list-style: none;
    padding-left: 0;
    li {
      border-top-right-radius: 5000px;
      border-bottom-right-radius: 5000px;
      padding: 8px;
      margin: 8px 0;
      cursor: pointer;
      &.active, &:hover {
        background-color: $alt-background;
      }
    }
  }
}
</style>
