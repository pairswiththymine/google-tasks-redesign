<template>
  <div class="task">
    <p class="title">{{ task.title }}</p>
    <p v-if="task.due">{{ task.due }}</p>
    <p v-if="task.notes">{{ shownNotes }}</p>
  </div>
</template>

<script>
export default {
  name: "task-item",
  props: {
    task: Object,
    expanded: false
  },
  computed: {
    shownNotes() {
      if(this.task.notes.length < 100) return this.task.notes
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
  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149);
  }
  .title {
    font-size: 1.5rem;
    margin: 0 0 0.4rem;
  }
}
</style>
