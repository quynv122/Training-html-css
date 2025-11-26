<script setup lang="js">
import { X, Plus } from 'lucide-vue-next'
import { ref } from 'vue'

const { columnId } = defineProps({
  columnId: {
    type: String,
    required: true
  }
})

const inputTitle = ref('')
const isAddTask = ref(false)

const emit = defineEmits(['handleAddTask'])

const handleSubmit = () => {
  if (!inputTitle.value.trim() || !columnId) return
  emit('handleAddTask', inputTitle.value.trim(), columnId)
  isAddTask.value = false
  inputTitle.value = ''
}
</script>
<template>
  <div class="w-full">
    <Transition name="fade-scale" mode="out-in">
      <!-- FORM THÊM THẺ -->
      <div v-if="isAddTask" key="form" class="bg-app-bg-task rounded-2xl p-3 shadow-sm
               border border-app-border-task flex flex-col gap-3">
        <input type="text" placeholder="Nhập tên thẻ" v-model="inputTitle" class="w-full px-3 py-2 rounded-xl
                 border border-app-border-task
                 bg-app-bg-modal
                 placeholder:text-app-text-muted
                 text-sm text-app-text-main
                 focus:outline-none focus:ring-2
                 focus:ring-app-brand focus:border-app-brand
                 transition-shadow" @keyup.enter="handleSubmit" />

        <div class="flex justify-between items-center gap-2 mt-1">
          <button type="button" @click="handleSubmit" class="flex-1 flex items-center justify-center gap-2
                   px-4 py-2 rounded-xl text-sm font-semibold
                   bg-app-brand text-white
                   hover:bg-app-brand-strong
                   transition-colors">
            <Plus class="w-4 h-4" />
            <span>Thêm thẻ</span>
          </button>

          <button type="button" class="p-2 rounded-xl
                   flex items-center justify-center
                   text-app-text-sub
                   hover:bg-app-brand-soft
                   transition-colors" @click="isAddTask = false">
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- NÚT "THÊM THẺ" -->
      <button v-else key="button" @click="isAddTask = true" type="button" class="mt-1 flex w-full items-center justify-center gap-2
               font-semibold text-sm
               bg-app-brand-soft
               text-app-text-main
               border border-dashed border-app-border-column
               py-3 rounded-2xl
               hover:bg-app-brand-strong hover:text-white
               transition-colors">
        <Plus class="w-4 h-4" />
        <span>Thêm thẻ</span>
      </button>
    </Transition>
  </div>
</template>


<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
