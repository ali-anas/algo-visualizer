import { updateSingleCell } from "./pathfinder.slice";
import { delay } from "../helpers/async";
import { tracePath } from "./trace.thunk";

export function highlightPath(grid, parents, delayDuration) {
  return async function(dispatch, getState) {
    async function updateCell(cell, cellType) {

      grid[cell.row][cell.col] = cellType;
      if(delayDuration) {
        dispatch(updateSingleCell({ ...cell, cellType}));
        await delay(delayDuration);
      }
    }

    const state = getState().pathfinder;
    // highlight the final path
    if(parents) {
      const pathLength = await tracePath({
        parents,
        sourceNode: state.source,
        destNode: state.dest,
        updateCell,
      })
    } else {
      console.log("path not found");
    }
  }
}