import { BFS } from "./path-finder/bfs";
import { DFS } from "./path-finder/dfs";

export const AlgorithmsMap = {
  'bfs': { name: 'Breadth First Search', fn: BFS },
  'dfs': { name: 'Depth First Search', fn: DFS }
}