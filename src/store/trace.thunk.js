import { CELL_TYPE } from "../constants";
export async function tracePath({ parents, sourceNode, destNode, updateCell}) {
  let row = destNode.row;
  let col = destNode.col;

  [row, col] = [parents[row][col].row, parents[row][col].col];

  let pathLength = 0;
  // if they are adjacent, we are done
  if(row === sourceNode.row && col === sourceNode.col) {
    return pathLength;
  }

  while(row !== sourceNode.row || col !== sourceNode.col) {
    await updateCell({row, col} , CELL_TYPE.PATH);
    [row, col] = [parents[row][col].row, parents[row][col].col];
    pathLength += 1;
  }

  return pathLength;
}