<template>
  <div 
    v-bind:class="'task ' + (expanded ? 'expanded' : 'not-expanded')"
    v-on:click="expanded = true">
    <p class="title">{{ task.title }}</p>
    <p v-if="task.due">{{ task.due }}</p>
    <div v-if="task.notes">
      <p v-show="!expanded" class="notes">{{ shownNotes }}</p>
      <textarea 
        ref="notesArea"
        v-show="expanded"
        v-on:keydown="resizeArea" 
        v-model="newNotes" 
        class="notes"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "task-item",
  props: {
    task: Object,
    expanded: false,
    newNotes: ""
  },
  created() {
    this.newNotes = this.task.notes
  },
  methods: {
    resizeArea(e) {
      setTimeout(() => {
        e.target.style.height = e.target.scrollHeight + "px"
      }, 0) // delay to get new text
    }
  },
  watch: {
    expanded() { this.resizeArea({ target: this.$refs.notesArea }) }
  },
  computed: {
    shownNotes() {
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
  .title {
    font-size: 1.5rem;
    margin: 0 0 0.4rem;
  }
  .notes {
    color: rgba($color, 0.5);
    border: none;
    width: 100%;
    font-size: 1rem;
    line-height: 1.3rem;
    overflow: hidden;
    font-family: $main-font;
    outline: none;
  }
}
</style>
