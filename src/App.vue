<template>
  <app-header
    :mines-count="minesCount"
    :seconds="seconds"
    v-model:game-level="gameLevel"
    v-model:mute="mute"
  ></app-header>

  <field
    :field-size="fieldSize"
    :map="map"
    @open="onOpenCell"
    @mark="onMarkCell"
  ></field>

  <popup :show="showPopup">
    <div class="result">
      <template v-if="gameOver">
        <img src="./assets/lost.png" alt="angry mine" class="result__img" />
        <button class="result__button" @click="startGame">
          <img src="./assets/update.png" alt="try again" />
          Попробовать еще раз
        </button>
      </template>

      <template v-if="won">
        <img src="./assets/won.png" alt="happy mine" class="result__img" />
        <button class="result__button" @click="startGame">
          <img src="./assets/update.png" alt="play again" />
          Сыграть еще раз
        </button>
      </template>
    </div>
  </popup>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GameLevel } from './types/GameLevel';
import AppHeader from './components/Header.vue';
import Field from './components/Field.vue';
import { FieldSize } from './types/FieldSize';
import {
  generateEmptyMap,
  generateMap,
  openAllMines,
  openCell,
} from './utils/field';
import { Cell } from './types/Cell';
import Popup from './components/UI/Popup.vue';
import BombAudioSrc from './assets/bomb.mp3';
import OpenCellAudioSrc from './assets/open.mp3';
import FlagAudioSrc from './assets/flag.mp3';
import ApplauseAudioSrc from './assets/applause.mp3';

const bombAudio = new Audio(BombAudioSrc);
const openCellAudio = new Audio(OpenCellAudioSrc);
const flagAudio = new Audio(FlagAudioSrc);
const applauseAudio = new Audio(ApplauseAudioSrc);

export default defineComponent({
  components: {
    AppHeader,
    Field,
    Popup,
  },
  data() {
    return {
      gameLevel: GameLevel.easy,
      minesCount: 10,
      seconds: 0,
      mute: false,
      map: [] as Cell[][],
      showPopup: false,
      isGameStart: true,
    };
  },
  computed: {
    fieldSize(): FieldSize {
      switch (this.gameLevel) {
        case GameLevel.easy:
          return { rows: 8, columns: 10, size: 'small' };
        case GameLevel.medium:
          return { rows: 14, columns: 18, size: 'medium' };
        case GameLevel.hard:
          return { rows: 20, columns: 24, size: 'large' };

        default:
          throw new Error('Unknown game level');
      }
    },
    gameOver(): boolean {
      for (let row of this.map as Cell[][]) {
        for (let cell of row) {
          if (cell.value === -1 && cell.open) {
            return true;
          }
        }
      }

      return false;
    },
    won(): boolean {
      for (let row of this.map as Cell[][]) {
        for (let cell of row) {
          if (cell.value >= 0 && !cell.open) {
            return false;
          }
        }
      }

      return true;
    },
  },
  provide() {
    return {
      gameLevelLabels: {
        [GameLevel.easy]: 'Простой',
        [GameLevel.medium]: 'Средний',
        [GameLevel.hard]: 'Сложный',
      },
    }
  },
  methods: {
    onChangeGameLevel(level: GameLevel) {
      this.gameLevel = level;
    },
    startGame() {
      switch (this.gameLevel) {
        case GameLevel.easy:
          this.minesCount = 10;
          break;
        case GameLevel.medium:
          this.minesCount = 40;
          break;
        case GameLevel.hard:
          this.minesCount = 99;
          break;
      }
      this.resetTimer();
      this.map = generateEmptyMap(this.fieldSize);
      this.isGameStart = true;
      this.showPopup = false;
    },
    startTimer() {
      this.resetTimer();

      this.timer = setInterval(() => {
        if (this.seconds < 999) {
          this.seconds++;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    resetTimer() {
      clearInterval(this.timer);
      this.seconds = 0;
    },
    onOpenCell(cell: Cell) {
      if (cell.open || cell.marked || this.gameOver || this.won) {
        return;
      }

      if (this.isGameStart) {
        this.map = generateMap(this.fieldSize, this.minesCount, cell);
        this.isGameStart = false;
        this.startTimer();
      }

      if (!this.mute) {
        if (cell.value >= 0) {
          openCellAudio.play();
        }

        if (cell.value === -1) {
          bombAudio.play();
        }
      }

      openCell(this.map, cell);
    },
    onMarkCell(cell: Cell) {
      if (this.gameOver || cell.open) {
        return;
      }

      if (!this.mute) {
        flagAudio.play();
      }

      if (cell.marked) {
        cell.marked = false;
        this.minesCount++;
      } else {
        cell.marked = true;
        this.minesCount--;
      }
    },
  },
  watch: {
    gameLevel() {
      this.startGame();
    },
    gameOver(isOver) {
      if (isOver) {
        openAllMines(this.map);
        clearInterval(this.timer);

        setTimeout(() => {
          this.showPopup = true;
        }, 2000);
      }
    },
    won(isWon) {
      if (isWon) {
        if (!this.mute) {
          applauseAudio.play();
        }

        clearInterval(this.timer);
        setTimeout(() => {
          this.showPopup = true;
        }, 2000);
      }
    },
  },
  created() {
    this.startGame();
  },
});
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #272727;
  font-family: 'Roboto', sans-serif;
}

.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  &__img {
    width: 256px;
  }

  &__button {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 2rem;
    background-color: #385821;
    color: #fff;
    font-size: 1.6rem;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;

    img {
      width: 2rem;
    }

    &:hover {
      background-color: #2f491c;
    }
  }
}
</style>
