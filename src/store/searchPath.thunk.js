import { CELL_TYPE, Status } from "../constants";
import { setVisitedCells, updateCells } from "./pathfinder.slice";
import { delay } from "../helpers/async";

export function searchPath(algo, delayDuration, initialGrid = null) {
  return async (dispatch, getState) => {
    let visitedCells = 0;

    function isSearching() {
      // If we provided an initialGrid (instant mode), we might ignore status checks or assume it allows it.
      // But let's keep it safe. If delayDuration is 0, we might skip this check or force it.
      // Ideally, if speed is 0, we don't change status to Searching, so this check might fail if we rely on status.
      // So checking delayDuration === 0 is good practice.
      return delayDuration === 0 || getState().pathfinder.status === Status.Searching;
    }

    /*
    * @param val - processed node
    */
    async function updateUI(grid, cells, cellType) {
      if (!isSearching()) {
        throw new Error("Path search cancelled!");
      }
      if (!Array.isArray(cells)) {
        cells = [cells];
      }

      cells.forEach(cell => {
        grid[cell.row][cell.col] = cellType
      })

      visitedCells += cells.length;
      if (delayDuration) {
        dispatch(setVisitedCells(visitedCells));
        dispatch(updateCells({ cells, cellType }))
        await delay(delayDuration);
      }
    }

    const state = getState().pathfinder;
    const { grid, parents } = await algo({
      grid: initialGrid || state.grid,
      startNode: state.source,
      endNode: state.dest,
      updateUI: updateUI
    });

    dispatch(setVisitedCells(visitedCells))
    return { grid, parents };
  }
}