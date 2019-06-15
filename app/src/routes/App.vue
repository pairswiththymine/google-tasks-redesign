<template>
  <div>
    <Header />
    <aside>
      <ul v-if="taskLists">
        <li 
          v-for="taskList in taskLists" 
          v-bind:key="taskList.id" 
          v-bind:class="'task-list ' + (taskList.id === active ? 'active' : '')"
          v-on:click="setActiveList(taskList.id)"
        >
          {{ taskList.title }}
        </li>
        <li class="break"></li>
      </ul>
    </aside>
    <main>
      <div class="lists" v-if="activeTasks">
        <task-item 
          v-for="task in activeTasks"
          v-bind:key="task.id"
          v-bind:task="task"
        />
      </div>
      <div 
        v-else 
        v-bind:class="'bg ' + (!activeTasks ? 'zero-state' : '')"></div>
    </main>
  </div>
</template>

<script>
import Header from "../components/Header.vue"
import TaskItem from "../components/task-item.vue"
import api from "../api.js"

export default {
  name: "app",
  components: {
    Header,
    TaskItem
  },
  data: () => ({
    taskLists: null,
    active: null,
    activeTasks: null,
    completeTasks: null,
  }),
  methods: {
    setActiveList(id) {
      this.active = id
      api.getTasks(this.active).then(res => {
        this.activeTasks = res.items
      }, console.error)
    }
  },
  created() {
    if(!api.authed()) this.$router.push("/")
    else {
      api.getTaskLists().then(res => {
        this.taskLists = res.items
        this.active = res.items[0].id
        api.getTasks(this.active).then(res => {
          this.activeTasks = res.items
        }, console.error)
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
    .task-list {
      border-top-right-radius: 5000px;
      border-bottom-right-radius: 5000px;
      padding: 12px 32px;
      margin: 12px 0;
      font-size: 1.1rem;
      background-color: transparent;
      transition: 0.1s background-color ease-in-out;
      cursor: pointer;
      &.active, &:hover {
        background-color: $alt-background;
      }
    }
    .break {
      height: 2px;
      width: 100%;
      background-color: $alt-background;
    }
  }
}

main {
  margin-left: 300px;
  margin-top: 64px;
  font-family: $main-font;
  .lists {
    width: 90%;
    margin: 0 auto;
    padding-top: 32px;
    display: grid;
    grid-template-columns: 50% 50%;
  }
  .bg {
    height: calc(100vh - 64px);
    width: 100%;
    background-size: 20%;
    background-position: center;
    background-repeat: no-repeat;
  }
  .zero-state {
    background-image: url("../assets/zero-state.svg");
  }
}
</style>
