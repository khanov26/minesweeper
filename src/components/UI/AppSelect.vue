<template>
  <div class="app-select">
    <div class="app-select__value" @click="open = !open">
      <span class="app-select__value-text">{{ options[modelValue] }}</span>
      <img
        src="../../assets/down-arrow.png"
        alt="arrow-down"
        class="app-select__icon"
      />
    </div>

    <div v-if="open" class="app-select__options">
      <div
        v-for="(label, value) in options"
        @click="onOptionSelect(value)"
        class="app-select__option"
      >
        {{ label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    options: {
      type: Object as PropType<Record<string, number | string>>,
      required: true,
    },
    modelValue: {
      type: [String],
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      open: false,
    }
  },
  methods: {
    onOptionSelect(option: string) {
      this.$emit('update:modelValue', option);
      this.open = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.app-select {
  position: relative;
  color: #000;
  cursor: pointer;

  &__value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    background-color: #fff;
    border-radius: 0.2rem;
    padding: 0.3rem 1rem;
  }

  &__icon {
    width: 1rem;
  }

  &__options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.3rem;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 0.2rem;
  }

  &__option {
    padding: 0.3rem 1rem;

    &:hover {
      background-color: #ccc;
    }
  }
}
</style>
