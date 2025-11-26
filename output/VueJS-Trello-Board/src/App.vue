<script setup lang="js">
import MainLayout from './layout/MainLayout.vue';
import Board from './components/board/Board.vue';
import CustomToast from './utils/CustomToast.vue';

</script>

<template>
  <CustomToast />
  <MainLayout>
    <Board> </Board>
  </MainLayout>
</template>
