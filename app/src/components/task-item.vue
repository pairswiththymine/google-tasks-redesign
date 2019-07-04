<template>
  <div 
    v-bind:class="'task ' + (expanded ? 'expanded' : 'not-expanded') + (hide ? ' hide' : '') + (subtask ? ' subtask' : '')"
  >
    <div v-bind:class="'title-bar ' + (this.completed ? 'completed' : '')">
      <button 
        class="complete"
        v-on:click="toggleComplete"
      >
        <div class="img">
          <img src="../assets/done.svg" alt="">
        </div>
      </button>
      <input 
        class="title" 
        v-bind:disabled="!expanded && !task.parent" 
        v-on:blur="saveNewNote"
        v-bind:placeholder="expanded ? 'Enter Title' : ''"
        v-model="newTitle" />
        <button class="expand" v-if="!task.loading">
          <img 
            v-on:click="expanded = !expanded"
            v-bind:class="expanded ? 'up' : 'down'"
            src="../assets/expand.svg">
        </button>
    </div>
    <div class="due">
      <button v-if="this.newDue" v-on:click="datePick = true" class="date">{{ this.formatDate(this.newDue) }}</button>
      <button v-else-if="this.expanded" class="date" v-on:click="datePick = true">Add date/time</button>
      <date-picker 
        v-if="datePick"
        v-bind:defaultDate="this.newDue ? new Date(this.newDue) : new Date()"
        v-on:change="handleDateChange"
        v-on:cancel="datePick = false"></date-picker>
    </div>
    <p v-if="!expanded" class="notes">{{ shownNotes }}</p>
    <textarea 
      ref="notesArea"
      v-else
      placeholder="Add details"
      v-on:keydown="resizeArea" 
      v-on:change="resizeArea" 
      v-model="newNotes" 
      v-on:blur="saveNewNote"
      class="notes"></textarea>
    <div v-if="task.subtasks && task.subtasks.length && !task.parent">
      <p>Subtasks</p>
      <task-item 
        v-for="subtask in task.subtasks"
        v-bind:key="subtask.id"
        v-bind:task="subtask"
        v-bind:subtask="true"
        v-bind:listId="listId"
      ></task-item>
    </div>
    <button v-if="expanded && !task.parent" class="add-subtask" v-on:click="addSubtask">Add subtasks</button>

    <div v-if="task.loading" class="loading"></div>
  
  </div>
</template>

<script>
import api from "../api.js"

import DatePicker from "./date-picker.vue"

export default {
  name: "task-item",
  components: {
    DatePicker
  },
  props: {
    task: Object,
    listId: String,
    subtask: Boolean
  },
  data: () => ({
    expanded: false,
    newNotes: "",
    newTitle: "",
    completed: false,
    newDue: null,
    hide: false,
    datePick: false
  }),
  mounted() {
    this.newNotes = this.task.notes
    this.newTitle = this.task.loading ? "creating task" : this.task.title
    this.completed = this.task.status === 'completed'
    this.newDue = this.task.due
  },
  methods: {
    formatDate(input) {
      let date = input
      if(typeof input === "string") date = new Date(input)
      
      return date.toLocaleString("en-us", {weekday: "short"}) + ", "  + date.toLocaleString('en-us', { month: 'long' }) + " " + date.getDate()
    },
    handleDateChange(newDate) {
      this.newDue = newDate
      this.saveNewNote()
      this.datePick = false
    },
    resizeArea(e) {
      setTimeout(() => {
        e.target.style.cssText = "height: auto; padding: 0"
        e.target.style.cssText = `height: ${e.target.scrollHeight}px`
      }, 0) // delay to get new text
    },
    saveNewNote() {
      return api.updateTask(this.task.id, this.listId, {
        title: this.newTitle,
        notes: this.newNotes,
        status: this.completed ? "completed" : "needsAction",
        due: this.newDue
      })
    },
    toggleComplete() {
      this.completed = !this.completed
      if(!this.task.parent) {
        this.hide = true
      } 
      this.saveNewNote().then(res => {
        setTimeout(() => { // wait for the animation to complete
          this.$emit("toggle-complete", this.completed)
          this.hide = false
        }, 500)
      })
    },
    addSubtask() {
      const task = {
        title: "subtask",
        parent: this.task.id,
        loading: true,
      }
      this.task.subtasks.push(task)
      api.createTask(this.listId, task).then(res => {
        this.$emit("reload-tasks")
      })
    }
  },
  watch: {
    expanded() { this.resizeArea({ target: this.$refs.notesArea }) }
  },
  computed: {
    shownNotes() {
      if(!this.newNotes) return ""
      if(this.expanded || this.newNotes.length < 100) return this.newNotes
      return this.newNotes.substring(0, this.newNotes.indexOf(" ", 90)) + "..."
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../_style.scss";

@keyframes pulsar {
  0% {
    width: 0;
    opacity: 0;
  }
  40% {
    opacity: 1;
    width: 200%;
  }
  100% {
    opacity: 0;
    width: 200%;
  }
}

.task {
  border: 1px solid $alt-background;
  border-radius: 8px;
  margin: 8px;
  padding: 8px 24px;
  transition: box-shadow ease-in-out 0.2s, 
              max-height ease-out 0.5s,
              padding ease-out 0.5s,
              opacity ease-out 0.5s,
              margin ease-out 0.5s,
              border ease-out 0.5s;
  overflow: hidden;
  height: auto;
  opacity: 1;
  position: relative;

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    border-top-right-radius: 5000px;
    border-bottom-right-radius: 5000px;
    height: 100%;
    width: 0;
    background-color: rgba($main, 0.3);
    animation: pulsar 1.3s ease-in-out infinite;
  }

  &.subtask {
    margin: 8px 0;
    padding: 4px 12px;
    border: none;
    &:hover {
      box-shadow: none;
    }
    .title-bar {
      align-items: center;
    }
    input.title {
      font-size: 1.1rem;
      margin: 0;
    }
  }
  &.hide {
    pointer-events: none;
    max-height: 0;
    padding: 0 24px;
    opacity: 0;
    margin: 0 8px;
    border: 0px solid transparent;
  }
  &.not-expanded { cursor: pointer; }
  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149);
  }
  .complete {
    height: 24px;
    width: 24px;
    border: 2px solid $alt-background;
    background-color: transparent;
    outline: none;
    border-radius: 50%;
    margin-right: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .img {
      width: 0;
      overflow: hidden;
      height: 24px;
      position: absolute;
      top: 0;
      left: 0;
      transition: width 0.1s cubic-bezier(0, 0.27, 1, 0.1);
    }
    img {
      vertical-align: middle;
      position: relative;
      top: -3px;
      color: $main;
      height: 24px;
      transition: width ease-in-out 0.1s;
    }
  }
  .completed>.complete>.img {
    width: 24px;
  }
  .title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
    .title {
      display: inline-block;
      font-size: 1.5rem;
      margin: 0 0 0.4rem;
      padding: 0.2rem 0.3rem;
      flex: 1;
      min-width: 0;
    }
    .expand {
      border: none;
      outline: none;
      background-color: transparent;
      cursor: pointer;
      img {
        transition: 0.2s ease-in-out all;
        &.down {
          transform: rotate(0);
        }
        &.up {
          transform: rotate(180deg)
        }
      }
    }
  }
  input, textarea {
    &:not(:disabled) {
      border: 1px solid $alt-background;
      border-bottom: 2px solid $alt-background;
    }
    background: transparent;
    border: none;
    outline: none;
    border: 1px solid transparent;
    border-bottom: 2px solid transparent;
    border-radius: 2px;
    &:focus {
      border-bottom: 2px solid $main;
    }
  }

  button.date, button.add-subtask {
    background: transparent;
    border: none;
    outline: none;
    padding: 6px 8px;
    cursor: pointer;
    background-color: rgba($alt-background, 0.3);
    border: 1px solid $alt-background;
    color: $alt-color;
    letter-spacing: 0.02rem;
    font-size: 0.9rem;
    border-radius: 4px;
    transition: 0.2s ease-in-out all;
    &:hover {
      border: 1px solid transparent;  
      box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149);
      background-color: #fff;
    }
    margin: 2px 0 8px;
  }
  
  .notes {
    color: rgba($color, 0.5);
    width: 100%;
    font-size: 1rem;
    line-height: 1.3rem;
    overflow: hidden;
    font-family: $main-font;
    margin: 0;
    padding: 8px 4px;
    border: 1px solid transparent;
  }
  textarea.notes {
    height: auto;
    color: $color;
    resize: none;
    box-sizing: initial;
  }
}
</style>
