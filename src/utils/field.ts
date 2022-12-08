import { FieldSize } from '../types/FieldSize';
import { Cell } from '../types/Cell';

export function generateMap(
  fieldSize: FieldSize,
  minesNumber: number,
  emptyCell: Cell
): Cell[][] {
  const emptyCells = getBorderCellsCoors(emptyCell, fieldSize);
  emptyCells.push([emptyCell.rowIndex, emptyCell.columnIndex]);
  const emptyCellsIndexes = emptyCells.map(([row, column]) =>
    getLinearIndex(row, column, fieldSize)
  );

  const mines = generateMines(
    fieldSize,
    minesNumber,
    new Set(emptyCellsIndexes)
  );

  let map = Array(fieldSize.rows)
    .fill(null)
    .map(() => Array(fieldSize.columns).fill(null));

  for (let row = 0; row < fieldSize.rows; row++) {
    for (let column = 0; column < fieldSize.columns; column++) {
      if (map[row][column] === null) {
        map[row][column] = {
          open: false,
          marked: false,
          value: calcMapValue(mines, fieldSize, row, column),
          rowIndex: row,
          columnIndex: column,
        };
      }
    }
  }

  return map;
}

export function generateEmptyMap(fieldSize: FieldSize): Cell[][] {
  let map = Array(fieldSize.rows)
    .fill(null)
    .map(() => Array(fieldSize.columns).fill(null));

  for (let row = 0; row < fieldSize.rows; row++) {
    for (let column = 0; column < fieldSize.columns; column++) {
      if (map[row][column] === null) {
        map[row][column] = {
          open: false,
          marked: false,
          value: 0,
          rowIndex: row,
          columnIndex: column,
        };
      }
    }
  }

  return map;
}

function getBorderCellsCoors(
  { rowIndex, columnIndex }: Pick<Cell, 'rowIndex' | 'columnIndex'>,
  { rows, columns }: Pick<FieldSize, 'rows' | 'columns'>
): [number, number][] {
  let borderCells: [number, number][] = [
    [rowIndex - 1, columnIndex - 1],
    [rowIndex - 1, columnIndex],
    [rowIndex - 1, columnIndex + 1],
    [rowIndex, columnIndex - 1],
    [rowIndex, columnIndex + 1],
    [rowIndex + 1, columnIndex - 1],
    [rowIndex + 1, columnIndex],
    [rowIndex + 1, columnIndex + 1],
  ];

  return borderCells.filter(([cellRow, cellColumn]) => {
    return (
      cellRow >= 0 && cellRow < rows && cellColumn >= 0 && cellColumn < columns
    );
  });
}

export function openCell(map: Cell[][], cell: Cell) {
  const mapRows = map.length;
  const mapColumns = map[0].length;

  if (cell.open) {
    return;
  }

  map[cell.rowIndex][cell.columnIndex].open = true;

  if (cell.value !== 0) {
    return;
  }

  const borderCells = getBorderCellsCoors(cell, {
    rows: mapRows,
    columns: mapColumns,
  });

  borderCells.forEach(([row, column]) => {
    openCell(map, map[row][column]);
  });
}

export function openAllMines(map: Cell[][]) {
  for (let row of map) {
    for (let cell of row) {
      if (cell.value === -1) {
        cell.open = true;
        cell.marked = false;
      }
    }
  }
}

function generateMines(
  fieldSize: FieldSize,
  minesNumber: number,
  exlude: Set<number>
): Set<number> {
  const cellsNumber = fieldSize.columns * fieldSize.rows;
  let minesCount = 0;
  let minesIndexes = new Set<number>();

  while (minesCount < minesNumber) {
    const random = getRandom(0, cellsNumber);
    if (minesIndexes.has(random) || exlude.has(random)) {
      continue;
    }

    minesIndexes.add(random);
    minesCount++;
  }

  return minesIndexes;
}

function calcMapValue(
  mines: Set<number>,
  fieldSize: FieldSize,
  row: number,
  column: number
) {
  const linearIndex = getLinearIndex(row, column, fieldSize);
  if (mines.has(linearIndex)) {
    return -1; // mine
  }

  const borderCells = getBorderCellsCoors(
    { rowIndex: row, columnIndex: column },
    fieldSize
  );

  let borderMinesCount = borderCells
    .map(([cellRow, cellColumn]) => {
      const linearIndex = getLinearIndex(cellRow, cellColumn, fieldSize);
      return Number(mines.has(linearIndex));
    })
    .reduce((sum, cur) => sum + cur);

  return borderMinesCount;
}

function getLinearIndex(row: number, column: number, fieldSize: FieldSize) {
  return row * fieldSize.columns + column;
}

function getRandom(from: number, to: number) {
  if (to < from) {
    throw new Error('Incorrect interval');
  }

  const interval = to - from;
  const random = Math.random();
  return Math.floor(random * interval) + from;
}
