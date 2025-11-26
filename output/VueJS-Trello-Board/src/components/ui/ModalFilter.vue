<script setup>
import { ref, computed, watch } from "vue"
import { X } from "lucide-vue-next"
import { caculatePositionModal } from "../../utils/caculatePositionModal"

defineOptions({ inheritAttrs: false })

const props = defineProps({
  keyWord: String,
  priority: String,
  modalPosition: {
    type: Object,
    required: true,
  },

})

const emit = defineEmits([
  "closeFilterModal",
  "handleApplyFilter",
  "handleResetFilter",
])

const inputKey = ref("")
const inputPriority = ref("")

const modalSize = {
  width: 300,
  height: 340,
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

watch(
  () => [props.keyWord, props.priority],
  ([newKey, newPriority]) => {
    inputKey.value = newKey || ""
    inputPriority.value = newPriority || ""
  },
  { immediate: true }
)

const handleClose = () => emit("closeFilterModal")
const handleReset = () => emit("handleResetFilter")
const handleApply = () => emit("handleApplyFilter", inputKey.value, inputPriority.value)
</script>
<template>
  <div class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-app-overlay backdrop-blur-[1px]" @click="handleClose"></div>
    <div class="absolute flex flex-col  shadow-[0_18px_40px_rgba(15,23,42,0.18)] rounded-2xl bg-app-bg-modal 
             border border-app-border-column overflow-hidden text-app-text-main" :style="modalStyles" role="dialog"
      aria-modal="true">
      <div class="flex items-start gap-3 px-4 py-3
               border-b border-app-border-column bg-app-brand-soft">
        <div class="flex-1">
          <h2 class="text-base font-semibold">
            Bộ lọc
          </h2>
        </div>
        <button @click="handleClose" class="no-drag mt-0.5 inline-flex h-7 w-7 items-center justify-center
                 rounded-full text-app-text-sub
                 hover:bg-app-bg-board hover:text-app-text-main
                 transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>
      <div class="flex-1 px-4 py-3 space-y-4 overflow-y-auto text-sm">
        <div>
          <label class="block text-xs font-medium text-app-text-sub mb-1.5">
            Từ khóa tìm kiếm
          </label>
          <input v-model="inputKey" type="text" class="w-full px-3 py-2 rounded-lg
                   border border-app-border-task
                   bg-app-bg-task
                   placeholder:text-app-text-muted text-sm text-app-text-main
                   focus:outline-none focus:ring-2 focus:ring-app-brand
                   focus:border-app-brand transition-shadow" placeholder="Nhập từ khóa..." />
        </div>

        <div>
          <label class="block text-xs font-medium text-app-text-sub mb-1.5">
            Mức độ ưu tiên
          </label>
          <select v-model="inputPriority" class="w-full px-3 py-2 rounded-lg
                   border border-app-border-task
                   bg-app-bg-task text-sm text-app-text-main
                   focus:outline-none focus:ring-2 focus:ring-app-brand
                   focus:border-app-brand transition-shadow">
            <option value="">Tất cả mức độ</option>
            <option value="Low">Thấp</option>
            <option value="Medium">Trung bình</option>
            <option value="High">Cao</option>
          </select>
        </div>
      </div>
      <div class="flex gap-3 px-4 py-3 border-t border-app-border-column
               bg-app-brand-soft/60">
        <button @click="handleReset" class="flex-1 px-4 py-2 text-xs sm:text-sm font-medium
                 rounded-xl bg-app-brand-soft text-app-text-main border border-dashed border-app-border-column
                hover:bg-app-brand-strong hover:text-white">
          Đặt lại
        </button>
        <button @click="handleApply" class="flex-1 px-4 py-2 text-xs sm:text-sm font-medium
                 rounded-xl bg-app-brand text-white
                 hover:bg-app-brand-strong transition-colors">
          Áp dụng
        </button>
      </div>
    </div>
  </div>
</template>
