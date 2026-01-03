import { BFS } from "./path-finder/bfs";
import { DFS } from "./path-finder/dfs";
import { Dijkstra } from "./path-finder/dijkstra";
import { AStar } from "./path-finder/astar";

export const AlgorithmsMap = {
  'bfs': { name: 'Breadth First Search', fn: BFS },
  'dfs': { name: 'Depth First Search', fn: DFS },
  'dijkstra': { name: "Dijkstra's Algorithm", fn: Dijkstra },
  'astar': { name: "A* Algorithm", fn: AStar }
}