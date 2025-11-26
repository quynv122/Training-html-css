<script setup>
import { SquarePen } from "lucide-vue-next";

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  columnId: {
    type: String,
    required: true,
  },
  editingTaskId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["openEditTaskModal"]);

const handleOpen = (event) => {
  emit("openEditTaskModal", props.task, props.columnId, event);
};
</script>

<template>
  <div :class="[
    'task group rounded-xl px-3 py-2.5 shadow-sm border border-slate-200/80',
    ' text-slate-900 cursor-pointer',
    'transition-all duration-150 ease-out hover:-translate-y-px hover:shadow-md hover:border-amber-400/80',
    props.editingTaskId === props.task.id ? 'bg-gray-400' : 'bg-white/95',
  ]">
    <div class="flex items-start gap-2">
      <h3 class="flex-1 truncate text-sm font-medium leading-snug">
        {{ props.task.title }}
      </h3>
      <button
        class="no-drag p-1 rounded-full text-slate-500 hover:bg-amber-100 hover:text-amber-800 transition-colors flex items-center justify-center"
        @click.stop="handleOpen" @mousedown.stop>
        <SquarePen class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
