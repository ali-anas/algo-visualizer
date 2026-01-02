import { setPathLength, updateSingleCell } from "./pathfinder.slice";
import { delay } from "../helpers/async";
import { tracePath } from "./trace.thunk";
import { toast } from "sonner";

let toastTimeout;
function showDebouncedToast(type, message) {
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  toastTimeout = setTimeout(() => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }, 500);
}

export function highlightPath(grid, parents, delayDuration) {
  return async function (dispatch, getState) {
    // If not dragging (delayDuration > 0), clear any pending debounced toast
    if (delayDuration > 0 && toastTimeout) {
      clearTimeout(toastTimeout);
    }

    let pathLength = 0;
    async function updateCell(cell, cellType) {

      grid[cell.row][cell.col] = cellType;
      pathLength += 1;
      if (delayDuration) {
        dispatch(setPathLength(pathLength));
        dispatch(updateSingleCell({ ...cell, cellType }));
        await delay(delayDuration);
      }
    }

    const state = getState().pathfinder;
    // highlight the final path
    if (parents) {
      if (delayDuration > 0) {
        toast.success("Path found!!!");
      } else {
        showDebouncedToast('success', "Path found!!!");
      }
      const pathLength = await tracePath({
        parents,
        sourceNode: state.source,
        destNode: state.dest,
        updateCell,
      })
      dispatch(setPathLength(pathLength));
    } else {
      if (delayDuration > 0) {
        toast.error("Path not found");
      } else {
        showDebouncedToast('error', "Path not found");
      }
    }
  }
}