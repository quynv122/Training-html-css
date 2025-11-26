<script setup>
import { onMounted } from 'vue';
import { updateGlobalOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Logic kiểm tra thiết bị
const checkDeviceAndSetup = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  // Cấu hình Toast toàn cục dựa trên thiết bị
  updateGlobalOptions({
    position: isMobile ? 'top-center' : 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    limit: 3,
    theme: 'colored',
    // Style riêng cho từng toast (tương đương prop toastStyle bên React)
    style: {
      borderRadius: '10px',
      padding: '10px 14px',
      fontSize: '14px',
      minWidth: '220px',
      maxWidth: '90vw',
    }
  });
};

// Chạy logic khi component được gắn vào DOM
onMounted(() => {
  checkDeviceAndSetup();
});
</script>

<template>
  
</template>

