import React from 'react'
import { AlgorithmsMap } from '../../lib/algorithms'
import { useSelector, useDispatch } from 'react-redux'
import { clearGrid, setStatus } from '../../store/pathfinder.slice'
import { searchPath } from '../../store/searchPath.thunk'
import { Status } from '../../constants'
import { highlightPath } from '../../store/highlight.thunk'


const Controller = () => {
  const dispatch = useDispatch();
  const status = useSelector(state => state.pathfinder.status);

  async function executeSearch(algo) {
    if(status === Status.Complete) {
      // clear the previous grid
      dispatch(clearGrid());
    }

    if(!algo) {
      return;
    }

    try {
      dispatch(setStatus(Status.Searching));
      // TODO: implement searchPath, highlightPath
      const { parents, grid } = await dispatch(searchPath(algo, 1));
      await dispatch(highlightPath(grid, parents, 1));
      dispatch(setGrid({ grid: grid}))
      dispatch(setStatus(Status.Complete));
    } catch(err) {
      // search is cancelled
    }
  }

  async function handleVisualize() {
    await executeSearch(AlgorithmsMap['bfs'].fn)
  }

  return (
    <button onClick={handleVisualize}>Visualize BFS</button>
  )
}

export default Controller