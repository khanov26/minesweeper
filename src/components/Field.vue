<template>
  <div
    class="field"
    :class="{
      'field--small': fieldClass.isSmall,
      'field--medium': fieldClass.isMedium,
      'field--large': fieldClass.isLarge,
    }"
  >
    <div v-for="row in fieldSize.rows" :key="row" class="field__row">
      <cell
        v-for="column in fieldSize.columns"
        :key="`${row}_${column}`"
        :cell="map[row - 1][column - 1]"
        @open="$emit('open', map[row - 1][column - 1])"
        @mark="$emit('mark', map[row - 1][column - 1])"
        class="field__cell"
      ></cell>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FieldSize } from '../types/FieldSize';
import Cell from './Cell.vue';
import { Cell as CellType } from '../types/Cell';

export default defineComponent({
  components: {
    Cell,
  },
  emits: {
    open(cell: CellType) {
      return 'open' in cell;
    },
    mark(cell: CellType) {
      return 'open' in cell;
    },
  },
  props: {
    fieldSize: {
      type: Object as PropType<FieldSize>,
      required: true,
    },
    map: {
      type: Array as PropType<CellType[][]>,
      required: true,
    },
  },
  computed: {
    fieldClass() {
      return {
        isSmall: this.fieldSize.size === 'small',
        isMedium: this.fieldSize.size === 'medium',
        isLarge: this.fieldSize.size === 'large',
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.field {
  &--small {
    --cellSize: min(10vmin, 3rem);
  }

  &--medium {
    --cellSize: min(5vmin, 3rem);
  }

  &--large {
    --cellSize: min(4vmin, 2.5rem);
  }

  &__row {
    display: flex;
  }

  &__cell {
    width: var(--cellSize);
    height: var(--cellSize);
  }
}
</style>
