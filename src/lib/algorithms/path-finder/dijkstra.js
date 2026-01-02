import { CELL_TYPE } from "../../../constants";
import { generateGrid } from "../../../helpers/pathfinder";

function sortNodesByDistance(unvisitedNodes, distances) {
  unvisitedNodes.sort((nodeA, nodeB) => distances[nodeA.row][nodeA.col] - distances[nodeB.row][nodeB.col]);
}

export async function Dijkstra({ grid: originalGrid, startNode, endNode, updateUI }) {
  const grid = originalGrid.map(row => row.slice());
  const rows = grid.length;
  const cols = grid[0].length;

  const distances = generateGrid(rows, cols, Infinity);
  const parents = generateGrid(rows, cols, null);
  const visited = generateGrid(rows, cols, false);

  distances[startNode.row][startNode.col] = 0;

  const unvisitedNodes = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      unvisitedNodes.push({ row: r, col: c });
    }
  }

  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes, distances);
    const closestNode = unvisitedNodes.shift();

    // If wall, skip
    // Note: In this project's grid, walls are represented by integer 3 (CELL_TYPE.WALL)
    // We need to check if the node is valid to traverse.
    // However, if we just blindly iterate unvisited, we might pick walls.
    // Walls should functionally have distance Infinity, so they naturally fall to the end of the sorted list if we don't relax them.
    // But better to check.
    if (grid[closestNode.row][closestNode.col] === CELL_TYPE.WALL) continue;

    // If shortest distance is infinity, we are trapped
    if (distances[closestNode.row][closestNode.col] === Infinity) return { parents: null, grid };

    visited[closestNode.row][closestNode.col] = true;

    // Visualize visited
    if (grid[closestNode.row][closestNode.col] === CELL_TYPE.EMPTY && !(closestNode.row === startNode.row && closestNode.col === startNode.col)) {
      await updateUI(grid, closestNode, CELL_TYPE.VISITED);
    }

    if (closestNode.row === endNode.row && closestNode.col === endNode.col) return { parents, grid };

    const neighbors = [];
    const { row, col } = closestNode;
    if (row > 0) neighbors.push({ row: row - 1, col });
    if (row < rows - 1) neighbors.push({ row: row + 1, col });
    if (col > 0) neighbors.push({ row, col: col - 1 });
    if (col < cols - 1) neighbors.push({ row, col: col + 1 });

    for (const neighbor of neighbors) {
      if (visited[neighbor.row][neighbor.col]) continue;

      const newDistance = distances[closestNode.row][closestNode.col] + 1;
      if (newDistance < distances[neighbor.row][neighbor.col]) {
        distances[neighbor.row][neighbor.col] = newDistance;
        parents[neighbor.row][neighbor.col] = closestNode;
      }
    }
  }

  return { parents: null, grid };
}