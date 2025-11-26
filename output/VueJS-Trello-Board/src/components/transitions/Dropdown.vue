<template>
  <transition name="drop">
    <div v-if="isOpen" class="modal">
      <slot></slot>
    </div>
  </transition>
</template>

<style scoped>
.drop-enter-active,
.drop-leave-active {
  transition: all 0.15s ease;
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
