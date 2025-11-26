<script setup lang="js">
import { X, Plus } from 'lucide-vue-next'
import { ref } from 'vue';


const inputName = ref('')
const isAddColumn = ref(false)

const emit = defineEmits(['handleAddColumn'])

const handleSubmit = () => {
  if (!inputName.value.trim())
    return;
  emit('handleAddColumn', inputName.value);
  isAddColumn.value = false;
  inputName.value = '';
}
</script>

<template>
  <div class="shrink-0 w-full max-w-xs sm:w-72 sm:min-w-72">

      <div v-if="isAddColumn" key="form" class="bg-app-bg-task rounded-2xl p-3 sm:p-4 shadow-sm
               border border-app-border-column flex flex-col gap-3">
        <input type="text" placeholder="Nhập tên cột" v-model="inputName" class="w-full px-3 py-2 rounded-xl
                 border border-app-border-column
                 bg-app-bg-modal
                 placeholder:text-app-text-muted
                 text-sm text-app-text-main
                 focus:outline-none focus:ring-2
                 focus:ring-app-brand focus:border-app-brand
                 transition-shadow" @keyup.enter="handleSubmit" />

        <div class="flex justify-between items-center gap-2">
          <button @click="handleSubmit" type="button" class="flex-1 flex items-center justify-center gap-2
                   px-4 py-2 rounded-xl text-sm font-semibold
                   bg-app-brand text-white
                   hover:bg-app-brand-strong
                   transition-colors">
            Thêm cột
          </button>

          <button type="button" class="p-2 rounded-xl flex items-center justify-center
                   text-app-text-sub
                   hover:bg-app-brand-soft
                   transition-colors" @click="isAddColumn = false">
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
      <button v-else key="button" @click="isAddColumn = true" class="mt-1 flex w-full items-center justify-center gap-2
               font-semibold text-sm
               bg-app-brand-soft
               text-app-text-main
               border border-dashed border-app-border-column
               py-3 rounded-2xl
               hover:bg-app-brand-strong hover:text-white
               transition-colors">
        <Plus size="18" />
        <span>Thêm Cột</span>
      </button>
  </div>
</template>
