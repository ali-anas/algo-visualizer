import { CELL_TYPE } from "../constants";
import { setVisitedCells, updateCells } from "./pathfinder.slice";
import { delay } from "../helpers/async";

export function searchPath(algo, delayDuration) {
  return async (dispatch, getState) => {
    let visitedCells = 0;

    /*
    * @param val - processed node
    */
    async function updateUI(grid, cells, cellType) {
      if(!Array.isArray(cells)) {
        cells = [cells];
      }

      cells.forEach(cell => {
        grid[cell.row][cell.col] = cellType
      })

      visitedCells += cells.length;
      if(delayDuration) {
        dispatch(setVisitedCells(visitedCells));
        dispatch(updateCells({ cells, cellType}))
        await delay(delayDuration);
      }
    }

    const state = getState().pathfinder;
    const { grid, parents } = await algo({
      grid: state.grid,
      startNode: state.source,
      endNode: state.dest,
      updateUI: updateUI
    });

    dispatch(setVisitedCells(visitedCells))
    return { grid, parents };
  }
}