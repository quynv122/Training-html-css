<script setup lang="js">
import { ref, computed, watch } from "vue"
import { Copy, Trash2, X } from "lucide-vue-next"
import { caculatePositionModal } from "../../utils/caculatePositionModal"
import {formatDate} from '../../utils/date'
defineOptions({ inheritAttrs: false })

const props = defineProps({
  selectTask: {
    type: Object,
    required: true,
  },
  selectTaskInColumnId: {
    type: String,
    required: true,
  },
  modalPosition: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  "closeEditTaskModal",
  "handleDeleteTask",
  "handleEditTask",
])

const modalSize = {
  width: 450,
  height: 380,
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

const inputTitle = ref("")
const inputDesc = ref("")
const inputPriority = ref("")

const isSaveDisabled = computed(() => {
  if (!inputTitle.value.trim()) return true

  const hasChanges =
    inputTitle.value !== props.selectTask.title ||
    inputDesc.value !== props.selectTask.description ||
    inputPriority.value !== props.selectTask.priority

  return !hasChanges
})

const handleSubmit = () => {
  const newTaskData = {}

  if (inputTitle.value.trim())
    newTaskData.title = inputTitle.value.trim()

  if (inputDesc.value !== props.selectTask.description)
    newTaskData.description = inputDesc.value

  if (inputPriority.value.trim())
    newTaskData.priority = inputPriority.value

  if (Object.keys(newTaskData).length > 0) {
    emit("handleEditTask", newTaskData, props.selectTask.id, props.selectTaskInColumnId)
    emit("closeEditTaskModal")
  }
}

const handleDelete = () => {
  emit("handleDeleteTask", props.selectTask.id, props.selectTaskInColumnId)
}

const handleClose = () => {
  emit("closeEditTaskModal")
}

watch(
  () => props.selectTask,
  (newTask) => {
    if (!newTask) return
    inputTitle.value = newTask.title
    inputDesc.value = newTask.description
    inputPriority.value = newTask.priority
  },
  { immediate: true }
)
</script>

<template>
  <div class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-app-overlay" @click="handleClose"></div>
    <div class="absolute z-50" :style="modalStyles">
      <div class="flex h-full w-full flex-col rounded-2xl overflow-hidden text-sm">
        <div class="flex flex-1 gap-4 text-sm">
          <div class="flex-1 flex flex-col gap-3 min-w-0
                   bg-app-bg-task px-3 py-3 rounded-2xl shadow-2xl
                   border border-app-border-column text-app-text-main">
            <h3 class="text-sm font-semibold py-2 text-center">
              Chỉnh sửa task
            </h3>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-app-text-sub">
                Title
              </label>
              <input v-model="inputTitle" type="text" placeholder="Enter task title" class="w-full px-3 py-2 rounded-lg
                       border border-app-border-task
                       bg-app-bg-modal
                       text-sm text-app-text-main
                       placeholder:text-app-text-muted
                       focus:outline-none focus:ring-2
                       focus:ring-app-brand focus:border-app-brand
                       transition-shadow" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-app-text-sub">
                Mức độ ưu tiên
              </label>
              <select v-model="inputPriority" class="w-full px-3 py-2 rounded-lg
                       border border-app-border-task
                       bg-app-bg-modal
                       text-sm text-app-text-main
                       focus:outline-none focus:ring-2
                       focus:ring-app-brand focus:border-app-brand
                       transition-shadow">
                <option value="High">High (Cao)</option>
                <option value="Medium">Medium (Trung bình)</option>
                <option value="Low">Low (Thấp)</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-app-text-sub">
                Description
              </label>
              <textarea v-model="inputDesc" rows="4" placeholder="Nhập nội dung công việc..." class="w-full px-3 py-2 rounded-lg
                       border border-app-border-task
                       bg-app-bg-modal
                       text-sm text-app-text-main
                       placeholder:text-app-text-muted
                       focus:outline-none focus:ring-2
                       focus:ring-app-brand focus:border-app-brand
                       transition-shadow resize-none"></textarea>
            </div>
            <p class="mt-1 text-[11px] text-app-text-muted">
              Ngày tạo: {{ formatDate(props.selectTask.createdAt) }}
            </p>
          </div>
          <div class="w-40 flex flex-col justify-between gap-3 pt-16 pb-4">
            <div class="space-y-2">
              <button type="button" class="w-full flex items-center gap-2 px-3 py-2 rounded-xl
                       shadow-2xl border border-app-border-column
                       bg-app-bg-modal text-app-text-main
                       hover:bg-app-brand-soft
                       transition-colors">
                <Copy class="w-4 h-4" />
                <span class="text-xs font-medium">Nhân đôi task</span>
              </button>
              <button type="button" @click="handleDelete" class="w-full flex items-center gap-2 px-3 py-2 rounded-xl
                       shadow-2xl border border-app-border-column
                        bg-app-bg-modal text-app-danger
                       hover:bg-app-brand-soft
                       transition-colors">
                <Trash2 class="w-4 h-4" />
                <span class="text-xs font-medium">Xóa task</span>
              </button>
            </div>
            <div class="space-y-2 pt-2 border-t border-app-border-column">
              <button type="button" @click="handleSubmit" :disabled="isSaveDisabled" :class="[
                'w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-2xl border border-app-border-column',
                isSaveDisabled
                  ? 'bg-app-brand-soft text-app-text-muted cursor-not-allowed opacity-70'
                  : 'bg-app-brand text-white hover:bg-app-brand-strong'
              ]">
                Lưu thay đổi
              </button>
              <button type="button" @click="handleClose" class="w-full px-3 py-2 rounded-xl shadow-2xl border border-app-border-column
                       text-xs sm:text-sm font-medium
                       bg-app-bg-board text-app-text-main
                       hover:bg-app-bg-task
                       transition-colors">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
