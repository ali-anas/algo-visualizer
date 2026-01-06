import { CELL_TYPE } from "../../../constants";
import { initGrid } from "../../../helpers/pathfinder";
import { MinHeap } from "../../data-structures/MinHeap";

// Heuristic function: Manhattan distance
function heuristic(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

export async function AStar({ grid: originalGrid, startNode, endNode, updateUI }) {
    // 1. Grid Copy (to avoid mutating Redux state directly during search)
    // We only need to track 'visited' state for visualization.
    // If updateUI handles visualization, we might not need to write to 'grid' for logic,
    // but the visualizer expects us to return the grid state.
    const grid = originalGrid.map(row => row.slice());
    const rows = grid.length;
    const cols = grid[0].length;

    // 2. Data Structures
    // Open Set: MinHeap for fast retrieval of lowest fScore
    const openSet = new MinHeap(node => node.f);

    // Closed Array: 2D boolean array for O(1) lookup
    const closed = Array.from({ length: rows }, () => new Uint8Array(cols).fill(0));

    const parents = initGrid(rows, cols);

    // Score Arrays
    // gScore: Cost from start to current node
    // fScore: Estimated total cost (g + h)
    const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

    // Initialize Start Node
    gScore[startNode.row][startNode.col] = 0;
    fScore[startNode.row][startNode.col] = heuristic(startNode, endNode);

    openSet.push({
        row: startNode.row,
        col: startNode.col,
        f: fScore[startNode.row][startNode.col]
    });

    let visitedCells = 0;

    // 3. Main Loop
    while (!openSet.isEmpty()) {
        const current = openSet.pop();
        const { row, col } = current;

        // If we found the destination
        if (row === endNode.row && col === endNode.col) {
            return { parents, grid, visitedCells, pathLength: 0 };
        }

        // If already visited (closed), skip. 
        // This handles duplicates efficiently without needing to update priorities in the heap.
        if (closed[row][col]) continue;
        closed[row][col] = 1;

        // Visualization
        if (visitedCells > 0) { // Don't overwrite source visual
            grid[row][col] = CELL_TYPE.VISITED;
            if (updateUI) await updateUI(grid, { row, col }, CELL_TYPE.VISITED);
        }
        visitedCells++;

        // Neighbors (4-directional)
        const neighbors = [
            { r: row - 1, c: col }, // Up
            { r: row + 1, c: col }, // Down
            { r: row, c: col - 1 }, // Left
            { r: row, c: col + 1 }, // Right
        ];

        for (const neighbor of neighbors) {
            const { r: nRow, c: nCol } = neighbor;

            // Bounds Check
            if (nRow < 0 || nRow >= rows || nCol < 0 || nCol >= cols) continue;

            // Wall Check
            if (grid[nRow][nCol] === CELL_TYPE.WALL) continue;

            // Closed Check (Optimization: Don't process if already closed)
            if (closed[nRow][nCol]) continue;

            // Tentative G Score
            // Cost is 1 for all adjacent moves
            const tentativeGScore = gScore[row][col] + 1;

            if (tentativeGScore < gScore[nRow][nCol]) {
                // Found a better path to this neighbor
                parents[nRow][nCol] = { row, col };
                gScore[nRow][nCol] = tentativeGScore;
                fScore[nRow][nCol] = gScore[nRow][nCol] + heuristic({ row: nRow, col: nCol }, endNode);

                // Add to Open Set
                // We add new entry even if it exists (Lazy Deletion approach)
                openSet.push({
                    row: nRow,
                    col: nCol,
                    f: fScore[nRow][nCol]
                });
            }
        }
    }

    // Path not found
    return { parents: null, grid, visitedCells: 0, pathLength: 0 };
}
