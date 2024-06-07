import { CELL_SIZE, CELL_TYPE } from "../constants"

export const getGridSizeFromScreen = () => {
  const maxRows = Math.floor((window.innerHeight - 120 - 2 * CELL_SIZE) / CELL_SIZE);
  const maxCols = Math.floor((window.innerWidth - 2 * CELL_SIZE) / CELL_SIZE);

  return {
    maxRows,
    maxCols,
  }
}

export const generateGrid = (rows, cols, val) => {
  return Array.from(new Array(rows), () => new Array(cols).fill(val));
}

export const initGrid = (rows, cols) => {
  const grid = generateGrid(rows, cols, CELL_TYPE.EMPTY);
  grid[0][0] = CELL_TYPE.SOURCE;
  grid[rows-1][cols-1] = CELL_TYPE.DEST;
  return grid;
}


export const checkCellValid = (element)  => {
  if(!element || element.tagName !== 'BUTTON') {
    return { isValidCell: false };
  }

  const { row: r, col: c, cellType: ct } = element?.dataset;
  const row = Number(r ?? -1)
  const col = Number(c ?? -1)
  const cellType = Number(ct ?? -1)
  if (row === -1 || cellType === -1 || col === -1) {
    return { isValidCell: false };
  }
  return {
    isValidCell: true,
    selectedCell: { row, col, cellType },
  };
}