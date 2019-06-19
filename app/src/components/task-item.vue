<template>
  <div v-bind:class="'task ' + (expanded ? 'expanded' : 'not-expanded')">
    <div v-bind:class="'title-bar ' + (this.completed ? 'completed' : '')">
      <button 
        class="complete"
        v-on:click="toggleComplete"
      >
        <img src="../assets/done.svg" alt="">
      </button>
      <p class="title" v-show="!expanded">{{ task.title }}</p>
      <input 
        class="title" 
        v-show="expanded" 
        v-on:blur="saveNewNote"
        v-model="newTitle" />
        <button class="expand">
          <img 
            v-on:click="expanded = !expanded"
            v-bind:class="expanded ? 'up' : 'down'"
            src="../assets/expand.svg">
        </button>
    </div>
    <p v-if="task.due">{{ task.due }}</p>
    <p v-show="!expanded" class="notes">{{ shownNotes }}</p>
    <textarea 
      ref="notesArea"
      v-show="expanded"
      placeholder="Add details"
      v-on:keydown="resizeArea" 
      v-on:change="resizeArea"
      v-model="newNotes" 
      v-on:blur="saveNewNote"
      class="notes"></textarea>
  </div>
</template>

<script>
import api from "../api.js"

export default {
  name: "task-item",
  props: {
    task: Object,
    listId: String
  },
  data: () => ({
    expanded: false,
    newNotes: "",
    newTitle: "",
    completed: false
  }),
  created() {
    this.newNotes = this.task.notes
    this.newTitle = this.task.title
    this.completed = this.task.status === 'completed'
  },
  methods: {
    resizeArea(e) {
      setTimeout(() => {
        e.target.style.height = e.target.scrollHeight + "px"
      }, 0) // delay to get new text
    },
    saveNewNote() {
      api.updateTask(this.task.id, this.listId, {
        title: this.newTitle,
        notes: this.newNotes,
        status: this.completed ? "completed" : "needsAction"
      })
    },
    toggleComplete() {
      this.completed = !this.completed
      this.saveNewNote()
    }
  },
  watch: {
    expanded() { this.resizeArea({ target: this.$refs.notesArea }) }
  },
  computed: {
    shownNotes() {
      if(!this.task.notes) return ""
      if(this.expanded || this.task.notes.length < 100) return this.task.notes
      return this.task.notes.substring(0, this.task.notes.indexOf(" ", 90)) + "..."
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../_style.scss";

.task {
  border: 1px solid $alt-background;
  border-radius: 8px;
  margin: 8px;
  padding: 8px 24px;
  transition: box-shadow ease-in-out 0.2s;
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
    img {
      vertical-align: middle;
      position: relative;
      top: -3px;
      opacity: 0;
    }
  }
  .completed>.complete>img {
    opacity: 1;
  }
  .title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    background-color: $alt-background;
    border: none;
    outline: none;
    border-bottom: 2px solid transparent;
    transition: 0.2s border-bottom ease-in-out;
    border-radius: 2px;
    &:focus {
      border-bottom: 2px solid $main;
    }
  }
  .notes {
    color: rgba($color, 0.5);
    width: 100%;
    font-size: 1rem;
    line-height: 1.3rem;
    overflow: hidden;
    font-family: $main-font;
  }
  textarea.notes {
    color: $color;
  }
}
</style>
