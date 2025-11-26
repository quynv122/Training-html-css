<script setup lang="js">
import { Ellipsis, Plus } from 'lucide-vue-next';


const { column, selectColumnId } = defineProps({
  column: {
    type: Object,
    required: true
  },
  selectColumnId: {
    type: String,
  }
})

defineEmits(['openEditColumnModal'])
</script>

<template>
  <div class="w-80 min-w-80 h-full rounded-2xl overflow-hidden">
    <div class="rounded-2xl h-full overflow-hidden
              shadow-sm">
      <div class="flex justify-between items-center
               px-4 pb-6 pt-4 font-semibold bg-app-bg-column-body 
               column-drag-area cursor-grab active:cursor-grabbing text-app-text-on-amber">
        <div class="flex-1">
          <p class="truncate max-w-[90%]">
            {{ column.name }}
          </p>
        </div>

        <Ellipsis class="no-drag p-1 rounded transition cursor-pointer
                 hover:bg-app-brand-soft" :class="{ 'bg-app-brand-soft': column.id === selectColumnId }"
          @click.stop="$emit('openEditColumnModal', column, $event)" @mousedown.stop />
      </div>
      <div class="overflow-hidden pb-4 h-fit flex flex-col gap-4 rounded-b-2xl bg-app-bg-column-body ">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
