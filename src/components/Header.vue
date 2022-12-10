<template>
  <div class="header">
    <div class="header__item header__item--left">
      <app-select
        v-model="level"
        :options="gameLevelLabels"
      ></app-select>
    </div>

    <div class="header__item header__item--center">
      <div class="stat">
        <img src="../assets/flag.png" alt="flag" class="stat__img" />
        <span class="stat__count">{{ minesCount }}</span>
      </div>

      <div class="stat">
        <img src="../assets/stopwatch.png" alt="" class="stat__img" />
        <span class="stat__count">{{ seconds }}</span>
      </div>
    </div>

    <div class="header__item header__item--right">
      <div class="volume" @click="$emit('update:mute', !mute)">
        <img v-if="mute" src="../assets/mute.png" alt="volume" class="volume__img" />
        <img v-else src="../assets/volume.png" alt="volume" class="volume__img" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { GameLevel } from '../types/GameLevel';
import AppSelect from './UI/AppSelect.vue';

export default defineComponent({
  components: {
    AppSelect,
  },
  props: {
    gameLevel: {
      type: String as PropType<GameLevel>,
      required: true,
    },
    minesCount: {
      type: Number,
      required: true,
    },
    mute: {
      type: Boolean,
      required: true,
    },
    seconds: {
      type: Number,
      required: true,
    }
  },
  computed: {
    level: {
      get() {
        return this.gameLevel;
      },
      set(value: string) {
        this.$emit('update:gameLevel', value);
      },
    },
  },
  inject: ['gameLevelLabels'],
  emits: ['update:gameLevel', 'update:mute'],
  methods: {
    onLevelChange(value: GameLevel) {
      this.$emit('changeGameLevel', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #4a752c;
  gap: 1rem;
  color: #fff;

  &__item {
    display: flex;
    flex: 1;

    &--left {
      justify-content: flex-start;
    }

    &--center {
      justify-content: center;
      gap: 1rem;
    }

    &--right {
      justify-content: flex-end;
    }
  }
}

.level {
  padding: 0.5rem 1rem;

  &:focus-visible {
    outline: 1px solid #000;
  }
}

.stat {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &__img {
    width: 2.4rem;
  }

  &__count {
    font-size: 1.6rem;
    width: 3rem;
  }
}

.volume {
  cursor: pointer;

  &__img {
    display: block;
    width: 1.6rem;
  }
}
</style>
