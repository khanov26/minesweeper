<template>
  <div
    class="cell"
    :class="{
      'cell--open': cell.open,
      'cell--dark': isDark,
      'cell--light': !isDark,
    }"
    @click="$emit('open')"
    @contextmenu.prevent="$emit('mark')"
  >
    <img
      v-if="cell.marked"
      src="../assets/flag.png"
      alt="flag"
      class="cell__img"
    />
    <img
      v-if="showMine"
      src="../assets/bomb.png"
      alt="mine"
      class="cell__img"
    />
    <span
      v-else-if="showValue"
      :style="{ color: fontColor }"
      class="cell__value"
      >{{ cell.value }}</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Cell } from '../types/Cell';

const valueColors = [
  'blue',
  'darkgreen',
  'darkred',
  'purple',
  'orange',
  'skyblue',
  'yellow',
  'pink',
];

export default defineComponent({
  props: {
    cell: {
      type: Object as PropType<Cell>,
      required: true,
    },
  },
  emits: ['open', 'mark'],
  computed: {
    fontColor() {
      return valueColors[this.cell.value - 1];
    },
    bgColor() {
      if (this.cell.open) {
        if ((this.cell.rowIndex + this.cell.columnIndex) % 2) {
          return '#d7b798';
        } else {
          return '#e5c19e';
        }
      } else {
        if ((this.cell.rowIndex + this.cell.columnIndex) % 2) {
          return '#a2d048';
        } else {
          return '#aad650';
        }
      }
    },
    isDark() {
      return (this.cell.rowIndex + this.cell.columnIndex) % 2;
    },
    showMine() {
      return this.cell.open && this.cell.value === -1;
    },
    showValue() {
      return this.cell.open && this.cell.value > 0;
    }
  },
});
</script>

<style lang="scss" scoped>
.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;

  &--dark {
    background-color: #a2d048;
  }

  &--light {
    background-color: #aad650;
  }

  &:not(#{&}--open):hover {
    background-color: #c9f177;
  }

  &--open#{&}--dark {
    background-color: #d7b798;
  }

  &--open#{&}--light {
    background-color: #e5c19e;
  }

  &__img {
    width: 70%;
  }

  &__value {
    font-size: 1.6rem;
    font-weight: bold;
  }
}
</style>
