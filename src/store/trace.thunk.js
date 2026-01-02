import { CELL_TYPE } from "../constants";
export async function tracePath({ parents, sourceNode, destNode, updateCell }) {
  let row = destNode.row;
  let col = destNode.col;

  [row, col] = [parents[row][col].row, parents[row][col].col];

  let pathLength = 0;
  // if they are adjacent, we are done
  if (row === sourceNode.row && col === sourceNode.col) {
    return pathLength;
  }

  let lastNode = { row: destNode.row, col: destNode.col };

  while (row !== sourceNode.row || col !== sourceNode.col) {
    const parent = parents[row][col];

    // We have: lastNode (towards Dest) -> Current({row,col}) -> parent (towards Source)
    // We need to match the connection.

    const dr1 = row - lastNode.row;
    const dc1 = col - lastNode.col;

    const dr2 = parent.row - row;
    const dc2 = parent.col - col;

    // Directions relative to Current:
    // lastNode is at [ -dr1, -dc1 ] relative to Current? 
    // Wait, let's just look at neighbor positions.
    // 1. Where is lastNode? Top(-1,0), Bottom(1,0), Left(0,-1), Right(0,1)
    // 2. Where is parent?

    const lastDir = { r: lastNode.row - row, c: lastNode.col - col }; // Vector from Curr to Last
    const parentDir = { r: parent.row - row, c: parent.col - col }; // Vector from Curr to Parent

    let type = CELL_TYPE.PATH;

    // Check linear
    if (lastDir.r === 0 && parentDir.r === 0) type = CELL_TYPE.PATH_H;
    else if (lastDir.c === 0 && parentDir.c === 0) type = CELL_TYPE.PATH_V;
    else {
      // Corner
      // Identify quadrant. 
      // Top (r=-1), Bottom (r=1), Left (c=-1), Right (c=1)
      const hasTop = lastDir.r === -1 || parentDir.r === -1;
      const hasBottom = lastDir.r === 1 || parentDir.r === 1;
      const hasLeft = lastDir.c === -1 || parentDir.c === -1;
      const hasRight = lastDir.c === 1 || parentDir.c === 1;

      if (hasTop && hasLeft) type = CELL_TYPE.PATH_TL;
      else if (hasTop && hasRight) type = CELL_TYPE.PATH_TR;
      else if (hasBottom && hasLeft) type = CELL_TYPE.PATH_BL;
      else if (hasBottom && hasRight) type = CELL_TYPE.PATH_BR;
    }

    await updateCell({ row, col }, type);

    // Prepare for next
    lastNode = { row, col };
    [row, col] = [parent.row, parent.col];
    pathLength += 1;
  }

  return pathLength;
}