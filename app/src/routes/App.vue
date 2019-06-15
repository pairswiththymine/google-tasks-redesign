<template>
  <div>
    <Header />
    <aside>
      <ul v-if="taskLists">
        <li class="add">
          <input type="text" placeholder="create task list" v-on:keydown.enter="addTaskList">
        </li>
        <li class="break"></li>
        <li 
          v-for="taskList in taskLists" 
          v-bind:key="taskList.id" 
          v-bind:class="'task-list ' + (taskList.id === active ? 'active' : '')"
          v-on:click="setActiveList(taskList.id)"
        >
          {{ taskList.title }}
        </li>
      </ul>
    </aside>
    <main>
      <div class="actions">
        <input type="text" v-on:keydown.enter="addTask" placeholder="add a task">
        <div>
          <button v-on:click="showCompleted = !showCompleted">
            <span>{{showCompleted ? "hide" : "show"}} completed</span>
            <img src="../assets/done.svg" alt="toggle completed">
          </button>
          <button v-on:click="showActive = !showActive">
            <span>{{showActive ? "hide" : "show"}} active</span>
            <img src="../assets/list.svg" alt="toggle active">
          </button>
        </div>
      </div>
        <div v-if="shownTasks.length" class="lists">
          <task-item
            v-for="task in shownTasks"
            v-bind:key="task.id"
            v-bind:task="task"
          />
        </div>
        <div 
          v-else
          v-bind:class="'bg ' + (!activeTasks.length && completeTasks.length) ? 'completed' : 'zero-state'"
        ></div>
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
    showActive: true,
    showCompleted: false,
    shownTasks: []
  }),
  methods: {
    setActiveList(id) {
      this.active = id
      console.log(id)
      api.getTasks(this.active).then(res => {
        this.activeTasks = res.items || []
      }, console.error)
    },
    getTasks() {
      api.getTasks(this.active).then(res => {
        console.log(res)
        this.activeTasks = res.items.filter(t => t.status === "needsAction")
        this.completeTasks = res.items.filter(t => t.status === "completed")
      }, console.error)
    },
    getShownTasks() {
      this.shownTasks = []
      if(this.showActive) this.shownTasks = this.shownTasks.concat(this.activeTasks)
      if(this.showCompleted) this.shownTasks = this.shownTasks.concat(this.completeTasks)
    },
    addTask(e) {
      const task = {
        title: e.target.value
      }
      e.target.value = ""
      e.target.blur()
      this.activeTasks.splice(0, 0, task) // to make the insertion into the visual list instant
      api.createTask(this.active, task).then(res => {
        this.getTasks()
      })
    },
    getTaskLists(cb) {
      return api.getTaskLists().then(res => {
        this.taskLists = res.items
        cb(res)
      }, console.error)
    },
    addTaskList(e) {
      const taskList = {
        title: e.target.value
      }
      this.taskLists.push(taskList)
      e.target.blur()
      e.target.value = ""
      api.createTaskList(taskList).then(res => {
        this.getTaskLists()
      })
    }
  },
  watch: {
    activeTasks: function() { this.getShownTasks() },
    completeTasks: function() { this.getShownTasks() },
    showCompleted: function() { this.getShownTasks() },
    showActive: function() { this.getShownTasks() },
  },
  created() {
    if(!api.authed()) this.$router.push("/")
    else {
      this.getTaskLists(res => {
        this.taskLists = res.items
        this.active = res.items[0].id
        this.getTasks()
      })
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
      margin: 12px 0;
      font-size: 1.1rem;
      background-color: transparent;
    }
    .add {
      padding: 6px 26px;
      input { 
        border: none;
        outline: none;
        padding: 6px;
        width: 100%;
      }
      &:focus-within {
        &::after {
          width: 100%;
          left: 0;
        }
      }
      &::after {
        content: "";
        display: block;
        width: 0;
        background-color: $main;
        height: 2px;
        transition: 0.2s all ease-in-out;
        left: 50%;
        position: relative;
      }
    }
    .task-list {
      padding: 12px 32px;
      border-top-right-radius: 5000px;
      border-bottom-right-radius: 5000px;
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
  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;
    padding: 32px 0 8px;
    input {
      width: 60%;
      max-width: 480px;
      padding: 8px;
      border-radius: 8px;
      outline: none;
      border: none;
      margin: 0 8px;
      font-size: 1.1rem;
      box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149);
    }
    >div {
      button {
        margin: 0 8px;
        border-radius: 50%;
        background-color: transparent;
        outline: none;
        border: none;
        height: 42px;
        width: 42px;
        position: relative;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        &::after {
          content: "";
          position: absolute;
          z-index: -1;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background-color: $alt-background;
          transition: 0.05s all ease-in-out;
        }
        span {
          position: absolute;
          bottom: 0;
          border-radius: 2px;
          background-color: #222;
          color: rgba(255, 255, 255, 0.85);
          opacity: 0;
          padding: 4px 6px;
          white-space: nowrap;
          transition: 0.2s opacity ease-in-out, 0.2s bottom ease-in-out, 0.1s max-width ease-in-out;
          pointer-events: none;
          overflow: hidden;
          width: auto;
          max-width: 0;
        }
        &:hover {
          &::after {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          span {
            opacity: 1;
            bottom: -50%;
            max-width: 1000px;
          }
        }
      }
    }
  }
  .lists {
    width: 90%;
    margin: 0 auto;
    padding-top: 8px;
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
