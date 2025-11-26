<script setup>
const props = defineProps({
    appear: {
        type: Boolean,
        default: true,
    },
});
</script>

<template>
    <Transition :name="'modal-fade'" :appear="appear">
        <slot></slot>
    </Transition>
</template>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.16s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
