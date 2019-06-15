<template>
  <div class="task">
    <p>{{ task.title }}</p>
    <p v-if="task.due">{{ task.due }}</p>
    <p v-if="task.notes">{{ task.notes }}</p>
  </div>
</template>

<script>
export default {
  name: "task-item",
  props: {
    task: Object
  }
}
</script>

<style lang="scss" scoped>
@import "../_style.scss";

.task {
  border: 1px solid $alt-background;
  border-radius: 8px;
  margin: 8px;
}
</style>
