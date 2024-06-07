import { createSlice } from "@reduxjs/toolkit";
import { CELL_TYPE, Status } from "../constants";
import { getGridSizeFromScreen, initGrid } from "../helpers/pathfinder";

const { maxRows, maxCols } = getGridSizeFromScreen();

const initialState = {
  rows: maxRows,
  cols: maxCols,
  grid: initGrid(maxRows, maxCols),
  source: { row:0, col:0 },
  dest: { row: maxRows - 1, col:maxCols - 1 },
  status: Status.Ready,
  pathLength: 0,
}

export const pathfinderSlice = createSlice({
  name: 'pathfinder',
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    clearGrid: (state, action) => {
      // only clear the visited and final path cells
      const clonedGrid = state.grid.map(row => row.slice());

      for(const row of clonedGrid) {
        for(let j = 0; j < row.length; j++) {
          const cell = element[j];
          if(cell === CELL_TYPE.VISITED || cell === CELL_TYPE.PATH) {
            element[j] = CELL_TYPE.EMPTY;
          }
        }
      }
      
      state.grid = clonedGrid;
      state.status = Status.Ready;
    },
    updateCells: (state, action) => {

      const { cells, cellType } = action.payload;

      const clonedGrid = state.grid.map(row => row.slice())
      cells.forEach(cell => {
        clonedGrid[cell.row][cell.col] = cellType;
      })

      state.grid = clonedGrid;
    },
    updateSingleCell: (state, action) => {
      const payload = action.payload
      const { cellType, row, col } = payload;

      if(cellType === CELL_TYPE.SOURCE || cellType === CELL_TYPE.DEST) {
        const cType = cellType === CELL_TYPE.SOURCE ? 'source' : 'dest';
        const { row: prevRow, col: prevCol } = state[cType];

        state.grid[prevRow][prevCol] = CELL_TYPE.EMPTY;

        state[cType] = {
          row,
          col,
        }
      }
      state.grid[payload.row][payload.col] = payload.cellType;
    }

  },
});

export const { setStatus, clearGrid, updateCells, updateSingleCell } = pathfinderSlice.actions;

export default pathfinderSlice.reducer;
