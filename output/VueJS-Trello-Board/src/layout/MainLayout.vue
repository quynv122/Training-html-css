<script setup lang="js">
import Header from '../components/ui/Header.vue';

</script>

<template>
  <div class="h-screen w-full bg-app-bg-body overflow-hidden flex flex-col">
    <Header />
    <main class="flex-1">
      <slot></slot>
    </main>

    </div>
</template>