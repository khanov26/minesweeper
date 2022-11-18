<template>
  <div v-if="show" class="popup">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    show: {
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
