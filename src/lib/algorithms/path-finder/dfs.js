import { CELL_TYPE } from "../../../constants";
import { generateGrid } from "../../../helpers/pathfinder";

export async function DFS({ grid: originalGrid, startNode, endNode, updateUI }) {
  const grid = originalGrid.map(row => row.slice());

  const rows = grid.length;
  const columns = grid[0].length;

  const visited = generateGrid(rows, columns, false);
  const parents = generateGrid(rows, columns, null);

  async function dfsExplorer(currRow, currCol, parentRow = -1, parentCol = -1) {
    if(currRow < 0 || currCol < 0 || currRow >= rows || currCol >= columns) { 
      return false;
    }

    if (visited[currRow][currCol] || grid[currRow][currCol] === CELL_TYPE.WALL) {
      return false;
    }

    // mark the current node as visited
    visited[currRow][currCol] = true;
    parents[currRow][currCol] = { row: parentRow, col: parentCol };

    if(currRow === endNode.row  && currCol === endNode.col) {
      return true;
    }

    if (parentRow !== -1 && parentCol !== -1) {
      await updateUI(grid, { row: currRow, col: currCol }, CELL_TYPE.VISITED);
    }

    return (
      (await dfsExplorer(currRow + 1, currCol, currRow, currCol)) ||
      (await dfsExplorer(currRow, currCol + 1, currRow, currCol)) ||
      (await dfsExplorer(currRow - 1, currCol, currRow, currCol)) ||
      (await dfsExplorer(currRow, currCol - 1, currRow, currCol))
    )
  }

  const pathFound = await dfsExplorer(startNode.row, startNode.col);
  return pathFound ? { grid, parents } : { grid, parents: null };
}