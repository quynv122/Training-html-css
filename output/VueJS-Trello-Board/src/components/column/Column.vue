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
  <div class="flex items-start gap-4 sm:gap-6 h-[calc(100vh-120px)]">
    <div class="column w-[260px] sm:w-72 shrink-0 ">
      <div class="column-inner rounded-2xl overflow-hidden bg-amber-100/80 border border-amber-200  shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
        <div
          class="column-header flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-amber-300 text-amber-950 font-semibold column-drag-area cursor-grab active:cursor-grabbing select-none">
          <p class="column-title text-sm font-bold sm:text-[15px] leading-tight truncate max-w-[90%]">
            {{ column.name }}
          </p>
          <Ellipsis size="40"
            class="no-drag p-1.5 rounded-full cursor-pointer text-amber-900/80 hover:bg-amber-200/80 transition-colors"
            :class="{ 'bg-amber-100': column.id === selectColumnId }"
            @click.stop="$emit('openEditColumnModal', column, $event)" />
        </div>
        <div class="column-body bg-amber-50/80">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
