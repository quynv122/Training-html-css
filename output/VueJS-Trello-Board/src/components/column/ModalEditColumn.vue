<script setup lang="js">
import { ref, computed, watch } from "vue"
import { Copy, Trash2, X } from "lucide-vue-next"
import { caculatePositionModal } from "../../utils/caculatePositionModal"
import { debounce } from "lodash-es"

const props = defineProps({
  selectColumn: {
    type: Object,
    required: true,
  },
  modalPosition: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  "closeEditColumnModal",
  "handleDeleteColumn",
  "handleEditColumn",
])

const inputName = ref(props.selectColumn.name)

const modalSize = {
  width: 250,
  height: 300,
}

const position = computed(() =>
  caculatePositionModal(props.modalPosition, modalSize, 20)
)

const modalStyles = computed(() => ({
  top: position.value.top + "px",
  left: position.value.left + "px",
  width: modalSize.width + "px",
  height: modalSize.height + "px",
}))

const debouncedEmit = debounce((newName) => {
  emit("handleEditColumn", newName, props.selectColumn.id)
}, 600)

watch(inputName, (newName) => {
  debouncedEmit(newName)
})

watch(
  () => props.selectColumn,
  (col) => {
    if (col) inputName.value = col.name
  },
  { immediate: false }
)

const handleClose = () => emit("closeEditColumnModal")
const handleDelete = () => emit("handleDeleteColumn", props.selectColumn.id)
</script>

<template>
  <div class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-app-overlay" @click="handleClose"></div>
    <div class="absolute z-50 flex flex-col rounded-2xl
             bg-app-bg-modal shadow-xl
             border border-app-border-column overflow-hidden
             text-app-text-main" :style="modalStyles" role="dialog" aria-modal="true">
      <div class="flex items-center justify-between gap-3
               px-4 py-3
               border-b border-app-border-column
               bg-app-brand-soft">
        <h3 class="text-sm font-semibold">
          Chỉnh sửa cột
        </h3>

        <button type="button" class="no-drag inline-flex h-7 w-7 items-center justify-center
                 rounded-full text-app-text-sub
                 hover:bg-app-bg-board hover:text-app-text-main
                 transition-colors" @click.stop="handleClose">
          <X class="w-4 h-4" />
        </button>
      </div>
      <div class="flex-1 px-4 py-3 space-y-4 text-sm overflow-y-auto">
        <div>
          <label class="block text-xs font-medium text-app-text-sub mb-1.5">
            Tên cột
          </label>
          <input v-model="inputName" type="text" placeholder="Nhập tên cột" class="w-full px-3 py-2 text-sm rounded-xl
                   border border-app-border-column
                   bg-app-bg-task
                   text-app-text-main
                   placeholder:text-app-text-muted
                   focus:outline-none focus:ring-2
                   focus:ring-app-brand focus:border-app-brand
                   transition-shadow" />
        </div>

        <ul class="space-y-1.5 text-sm">
          <li>
            <button type="button" class="w-full flex items-center gap-2 px-3 py-2 rounded-xl
                     bg-transparent text-app-text-main
                     hover:bg-app-brand-soft
                     active:bg-app-brand-strong/10
                     transition-colors">
              <Copy class="w-4 h-4" />
              <span>Nhân đôi cột</span>
            </button>
          </li>

          <li>
            <button type="button" class="w-full flex items-center gap-2 px-3 py-2 rounded-xl
                     bg-app-danger/5 text-app-danger
                     hover:bg-app-danger/10 active:bg-app-danger/15
                     transition-colors" @click="handleDelete">
              <Trash2 class="w-4 h-4" />
              <span>Xóa danh sách</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.column-modal-enter-active,
.column-modal-leave-active {
  transition: opacity 0.16s ease-out;
}

.column-modal-enter-from,
.column-modal-leave-to {
  opacity: 0;
}
</style>
