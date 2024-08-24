import { CELL_TYPE } from "../../../constants";
import { generateGrid } from "../../../helpers/pathfinder";

function addToQueueIfValidNode(grid, parents, visited, queue) {
  return function (row, col, nextRow, nextCol) {
    const maxRows = grid.length;
    const maxCols = grid[0].length;
    if(nextRow < maxRows && nextCol < maxCols && nextRow >= 0 && nextCol >= 0) {
      if(!visited[nextRow][nextCol] && grid[nextRow][nextCol] !== 3) {
        queue.push({ col: nextCol, row: nextRow});
        visited[nextRow][nextCol] = true;
        parents[nextRow][nextCol] = { row, col };
      }
    }
  }
}

export async function BFS({ grid: originalGrid, startNode, endNode, updateUI }) {
  const grid = originalGrid.map(row => row.slice());
  const rows = grid.length;
  const columns = grid[0].length;

  const visited = generateGrid(rows, columns, false);
  const parents = generateGrid(rows, columns, null);

  const queue = [startNode];
  visited[startNode.row][startNode.col] = true;

  const addToQueue = addToQueueIfValidNode(
    grid,
    parents,
    visited,
    queue
  )
  
  while(queue.length) {
    // at start of each iteration i, queue will contain nodes that are equidisant from source at distance i
    const nDistantNodes = queue.length;

    const processedNodes = [];
    for(let i = 0; i < nDistantNodes; i++) {
      const front = queue.shift();

      if(front.row === endNode.row && front.col === endNode.col) {
        return { parents, grid }
      }

      const { row: currRow, col: currCol } = front;

      addToQueue(currRow, currCol, currRow, currCol+1);
      addToQueue(currRow, currCol, currRow+1, currCol);
      addToQueue(currRow, currCol, currRow, currCol-1);
      addToQueue(currRow, currCol, currRow-1, currCol);

      // push all currently processed nodes into queue to mark in ui for current iteration
      processedNodes.push({ row: currRow, col: currCol})
    }

    for(const val of processedNodes) {
      if(!visited[val.row][val.col] && grid[val.row][val.col] !== 3) {
        visited[val.row][val.col] = true;
        parents[val.row][val.col] = { row: val.row, col: val.col};
        queue.push(val);
      }

      if(grid[val.row][val.col] === CELL_TYPE.EMPTY) {
        await updateUI(grid, val, CELL_TYPE.VISITED);
      }
    }
  }

  return { grid, parents: null };
}