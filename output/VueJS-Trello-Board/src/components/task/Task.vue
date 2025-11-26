<script setup lang="js">
import { SquarePen } from 'lucide-vue-next'

const { task, editingTaskId, columnId } = defineProps({
  task: {
    type: Object,
    require: true
  },
  editingTaskId: String,
  columnId: String
})
defineEmits(['openEditTaskModal'])
</script>
<template>
  <div :class="{
    'border-2 border-app-brand': task.id === editingTaskId
  }" class="task rounded-lg py-2 px-3 shadow-sm cursor-pointer
           bg-app-bg-task text-app-text-main 
           transition-colors duration-150 hover:bg-app-bg-task-hover
            hover:shadow-md">
    <div class="flex justify-between items-center gap-2">
      <h3 class="truncate max-w-[85%] text-sm">
        {{ task.title }}
      </h3>
      <button @click.stop="$emit('openEditTaskModal', task, columnId, $event)" class="p-1 rounded
               text-app-text-sub
               hover:bg-app-brand-soft hover:text-app-text-main
               transition-colors">
        <SquarePen size="18" />
      </button>
    </div>
  </div>
</template>
