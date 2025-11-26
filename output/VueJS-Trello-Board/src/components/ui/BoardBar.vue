<script setup>
import {
  Funnel,
  Lock,
  Earth,
  Plus,
  Sun,
  Moon,
  FunnelPlus,
} from "lucide-vue-next";
import { ref } from "vue";
import { useTheme } from "../../composables/useTheme";



const { isFilter, showFilterModal } = defineProps({
  isFilter: {
    type: Boolean,
  },
  showFilterModal: {
    type: Boolean,
  },
});

defineEmits(["openFilterModal"]);

const { theme, toggleTheme } = useTheme();

const status = ref("public");
</script>

<template>
  <div class="board-bar bg-app-bg-boardbar border-b border-app-border-board">
    <div class="h-14 px-3 sm:px-6 lg:px-10 flex items-center">
      <nav
        class="ml-auto flex items-center font-bold text-xs sm:text-sm gap-2 sm:gap-3 lg:gap-4 flex-nowrap text-app-text-main">
        <div class="sm:w-[88px]">
          <button v-if="isFilter" @click="$emit('openFilterModal', $event)"
            class="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 min-h-[40px] rounded-full sm:rounded-2xl border border-transparent transition-colors"
            :class="[
              'hover:bg-app-brand-soft',
              showFilterModal
                ? 'bg-app-brand-soft shadow-sm border-app-border-column'
                : 'bg-transparent',
              'text-app-accent',
            ]">
            <FunnelPlus class="w-5 h-5" />
            <span class="hidden sm:inline">Filter</span>
          </button>

          <button v-else @click="$emit('openFilterModal', $event)"
            class="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 min-h-[40px] rounded-full sm:rounded-2xl border border-transparent transition-colors"
            :class="[
              'hover:bg-app-brand-soft',
              showFilterModal
                ? 'bg-app-brand-soft shadow-sm border-app-border-column '
                : 'bg-transparent text-app-text-main',
            ]">
            <Funnel class="w-5 h-5" />
            <span class="hidden sm:inline">Filter</span>
          </button>
        </div>

        <div class="sm:w-[88px]">
          <button
            class="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 min-h-[40px] rounded-full sm:rounded-2xl border border-transparent text-app-text-main hover:bg-app-brand-soft transition-colors">
            <Plus class="w-5 h-5" />
            <span class="hidden sm:inline">Invite</span>
          </button>
        </div>
        <div class="sm:w-[110px]" @click="status = status === 'public' ? 'private' : 'public'">
          <button v-if="status === 'public'"
            class="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 min-h-[40px] rounded-full sm:rounded-2xl border border-transparent text-app-text-main hover:bg-app-brand-soft transition-colors">
            <Earth class="w-5 h-5" />
            <span class="hidden sm:inline">Public</span>
          </button>
          <button v-else
            class="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 min-h-[40px] rounded-full sm:rounded-2xl border border-transparent text-app-text-main hover:bg-app-brand-soft transition-colors">
            <Lock class="w-5 h-5" />
            <span class="hidden sm:inline">Private</span>
          </button>
        </div>
        <div class="sm:w-[96px]" @click="toggleTheme">
          <button v-if="theme === 'dark'"
            class="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 min-h-[40px] rounded-full sm:rounded-2xl border border-transparent text-app-text-main hover:bg-app-brand-soft transition-colors">
            <Moon class="w-5 h-5" />
            <span class="hidden sm:inline">Dark</span>
          </button>
          <button v-else
            class="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 min-h-[40px] rounded-full sm:rounded-2xl border border-transparent bg-transparent text-app-text-main hover:bg-app-brand-soft transition-colors">
            <Sun class="w-5 h-5" />
            <span class="hidden sm:inline">Light</span>
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>

<style scoped></style>
