<template>
  <div>
    <Header v-on:toggle-menu="toggleAside"/>
    <aside v-bind:class="showAside ? 'show' : 'hide'">
      <ul v-if="taskLists">
        <li class="add">
          <input type="text" placeholder="create task list" v-on:keydown.enter="addTaskList">
        </li>
        <li class="break"></li>
        <li 
          v-for="(taskList, i) in taskLists" 
          v-bind:key="taskList.id" 
          v-bind:class="'task-list ' + (taskList.id === active ? 'active' : '') + (taskList.loading ? ' loading' : '')"
          v-on:click="setActiveList(taskList.id)"
        >
          <p v-if="renamingList !== taskList.id">{{ !taskList.loading ? taskList.title : "creating task list" }}</p>
          <input 
            v-else type="text" 
            v-bind:value="taskList.title"
            id="renaming-tasklist"
            autofocus
            v-on:keydown.enter="renameTaskList"
          >
          <div class="actions">
            <button 
              class="action"
              v-on:click="e => {
                e.stopPropagation()
                handleRenameAction(taskList.id)  
              }"
            >
              <img 
                v-bind:src="(renamingList !== taskList.id) ? require('../assets/edit.svg') : require('../assets/done.svg')" 
                v-bind:alt="(renamingList !== taskList.id) ? 'rename' : 'confirm'">
            </button>
            <button 
              class="action"
              v-if="renamingList !== taskList.id"
              v-on:click="e => {
                e.stopPropagation()
                deleteTaskList(taskList.id, i)
              }"
            >
              <img src="../assets/delete.svg">
            </button>
          </div>
        </li>
      </ul>
    </aside>
    <main v-bind:class="(showAside ? 'bump' : '')">
      <div class="actions">
        <input type="text" v-on:keydown.enter="addTask" placeholder="add a task">
        <div>
          <button v-on:click="showCompleted = !showCompleted" class="action">
            <span>{{showCompleted ? "hide" : "show"}} completed</span>
            <img src="../assets/done.svg" alt="toggle completed">
          </button>
          <button v-on:click="showActive = !showActive" class="action">
            <span>{{showActive ? "hide" : "show"}} active</span>
            <img src="../assets/list.svg" alt="toggle active">
          </button>
        </div>
      </div>
      <div v-bind:class="'container ' + (mainFaded ? ' faded' : '')">
        <div 
          class="lists">
          <task-item
            v-for="task in shownTasks"
            v-bind:key="task.id"
            v-bind:task="task"
            v-bind:listId="active"
            v-on:toggle-complete="val => toggleComplete(task.id, val)"
          />
        </div>
        <div 
          v-if="shownTasks && shownTasks.length === 0"
          v-bind:key="active"
          v-bind:class="'bg ' + (shownTasks.length === 0 ? 'show' : '')"
        >
          <img :src="((!activeTasks.length && completeTasks.length) ? emptyState : zeroState)" />
          <!-- intentionally seperated for fade in animation -->
          <div v-if="!activeTasks.length && completeTasks.length">
            <p>Nicely done!</p>
            <p>You've finished all your tasks. Take a second to recharge</p>
          </div>
          <div v-else>
            <p v-bind:key="active">A fresh start</p>
            <p v-bind:key="active + '_'">Anything to add?</p>
          </div>
        </div>
      </div>
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
    TaskItem,
  },
  data: () => ({
    taskLists: null,
    active: null,
    activeTasks: [],
    completeTasks: [],
    showActive: true,
    showCompleted: false,
    shownTasks: null,
    renamingList: null,
    showAside: true,
    mainFaded: false,
    allTasks: [],
    // hack to make img src work
    emptyState: require('../assets/empty-state.svg'),
    zeroState: require('../assets/zero-state.svg')
  }),
  methods: {
    toggleComplete(id, newVal) {
      if(newVal) { // if not completed -> completed
        const index = this.activeTasks.findIndex(t => id === t.id)
        const task = this.activeTasks.splice(index, 1)
        task.completed ="completed"
        this.completeTasks.push(task[0])
      } else { // if completed -> not completed
        const index = this.completeTasks.findIndex(t => id === t.id)
        const task = this.completeTasks.splice(index, 1)
        task.completed = "needsAction"
        this.activeTasks.push(task[0])
      }
      this.getTasks()
      this.getShownTasks()
    },
    toggleAside() { this.showAside = !this.showAside },
    handleRenameAction(id) {
      if(this.renamingList === id) {
        this.renameTaskList({ target: document.getElementById("renaming-tasklist") }) // emulate event
      } else this.renamingList = id
    },
    renameTaskList(e) {
      api.renameTaskList(this.renamingList, e.target.value).then(res => {
        this.getTaskLists()
      })
      e.target.blur()
      this.taskLists[this.taskLists.findIndex(t => t.id === this.renamingList)].title = e.target.value
      this.renamingList = null
    },
    deleteTaskList(id, i) {
      this.taskLists.splice(i, 1)
      this.active = this.taskLists[0].id
      api.deleteTaskList(id).then(() => {
        this.getTaskLists()
      })
    },
    setActiveList(id) {
      if(this.active !== id) {
        this.mainFaded = true
        this.active = id
        this.getTasks()
      }
    },
    getTasks() {
      api.getTasks(this.active).then(res => {
        this.activeTasks = []
        this.completeTasks = []
        this.mainFaded = false
        this.allTasks = res.items || []
        let tasks = {}
        let subTasks = []
        if(res.items) {
          res.items.forEach(task => {
            tasks[task.id] = { ...task, subtasks: [] }
          })

          for(let task in tasks) {
            if(tasks[task].parent) tasks[tasks[task].parent].subtasks.push(tasks[task])
            else {
              if(tasks[task].status === "needsAction") this.activeTasks.push(tasks[task])
              else if(tasks[task].status === "completed") this.completeTasks.push(tasks[task]) 
            }
          }
        } else {
          this.activeTasks = []
          this.completeTasks = []
        }
        this.getShownTasks()
      }).catch(res => {
        this.mainFaded = false
        console.error(res)
      })
    },
    getShownTasks() {
      this.shownTasks = []
      if(this.showActive) this.shownTasks = this.shownTasks.concat(this.activeTasks)
      if(this.showCompleted) this.shownTasks = this.shownTasks.concat(this.completeTasks)
    },
    addTask(e) {
      const task = {
        title: e.target.value,
        loading: true
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
        cb && cb(res)
      }).catch(console.error)
    },
    addTaskList(e) {
      const taskList = {
        title: e.target.value,
        loading: true
      }
      e.target.blur()
      e.target.value = ""
      this.taskLists.push(taskList)
      api.createTaskList(taskList).then(res => {
        this.getTaskLists()
        this.setActiveList(res.id)
      })
    },
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

$fade-top: -20px;

@keyframes fade-down {
  0% {
    top: $fade-top;
    opacity: 0;
  }

  100% {
    top: 0;
    opacity: 1;
  }
}

@keyframes loading-task-list {
  0% {
    left: 0;
    top: 50%;
    opacity: 0;
    height: 0;
    width: 0;
  }

  70% {
    left: -300px;
    top: -300px;
    opacity: 1;
    height: 600px;
    width: 600px;
  }

  100% {
    left: -300px;
    top: -300px;
    opacity: 0;
    height: 600px;
    width: 600px;
  }
}

aside {
  height: 100vh;
  width: 300px;
  padding-top: 64px;
  position: fixed;
  top: 0;
  left: 0;
  font-family: $main-font;
  transition: left 0.2s ease-in-out;
  &.show { left: 0 }
  &.hide { left: -300px }
  ul {
    list-style: none;
    padding-left: 0;
    li:not(.break) {
      margin: 12px 0;
      font-size: 1.1rem;
      padding: 8px 2px 8px 26px;
      background-color: transparent;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      input { 
        border: none;
        outline: none;
        padding: 8px 0;
        width: 100%;
        font-size: 1.1rem;
        background-color: transparent;
        position: relative;
        z-index: 2;
      }
      &:hover {
        .actions {
          opacity: 1;
        }
      }
      .actions {
        min-width: max-content;
        opacity: 0;
        transition: 0.1s ease-in-out opacity;
        >button {
          display: inline-block;
        }
      }
      p {
        margin: 0;
        word-wrap: none;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &:focus-within {
        &::after {
          width: calc(100% - 112px);
          left: 26px;
        }
      }
      &::after {
        content: "";
        position: absolute;
        display: block;
        width: 0;
        background-color: $main;
        height: 2px;
        transition: 0.2s all ease-in-out;
        left: calc(50% + 26px);
        bottom: 12px;
      }
    }
    .task-list {
      border-top-right-radius: 5000px;
      border-bottom-right-radius: 5000px;
      transition: 0.1s background-color ease-in-out;
      cursor: pointer;
      &.active, &:hover {
        background-color: $alt-background;
      }
      &.loading {
        opacity: 0.3;
        overflow: hidden;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          background-color: rgba($main, 0.3);
          animation: loading-task-list 2s linear infinite;
        }
        cursor: wait;
        &:hover>.actions {
          opacity: 0 !important;
        }
      }
      &:hover>button {
        opacity: 1;
      }
      >button {
        opacity: 0;
        transition: 0.1s opacity ease-in-out;
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
  &.bump { margin-left: 300px; }
  margin-left: 150px;
  transition: margin-left 0.15s ease-in-out; // intentionally offset
  margin-top: 64px;
  font-family: $main-font;
  width: calc(100% - 300px);
  position: relative;
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
  }
  .lists {
    width: 90%;
    margin: 0 auto;
    padding-top: 8px;
    display: grid;
    grid-template-columns: 50% 50%;
    @media only screen and (max-width: 1100px) {
      grid-template-columns: 100%;
    }
  }
  .container {
    opacity: 1;
    transition: opacity 0.1s ease-in-out;
    &.faded { opacity: 0; }
  }
  .bg {
    height: calc(100vh - 64px);
    width: 100%;
    background-size: 30%;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    >div {
      width: 100%;
      p {
        text-align: center;
        animation: fade-down 0.15s ease-in-out forwards;
        position: relative;
        top: $fade-top;
        opacity: 0;
        &:first-child {
          font-weight: 700;
          letter-spacing: 0.1rem;
          animation-delay: 0.1s;
        }
        &:last-child {
          animation-delay: 0.15s;
        }
      }
    }
    &.show { opacity: 1; }
  }
}
.action {
  margin: 0 4px;
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
  z-index: 1;
  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background-color: rgba(#000, 0.05);
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
</style>
