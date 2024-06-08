import React from 'react'
import { AlgorithmsMap } from '../../lib/algorithms'
import { useSelector, useDispatch } from 'react-redux'
import { clearGrid, setStatus, setGrid } from '../../store/pathfinder.slice'
import { searchPath } from '../../store/searchPath.thunk'
import { Status } from '../../constants'
import { highlightPath } from '../../store/highlight.thunk'
import classes from './controller.module.scss';
import { useEffect } from 'react'


const Controller = () => {
  const dispatch = useDispatch();
  const pathfinder = useSelector(state => state.pathfinder);
  const status = useSelector(state => state.pathfinder.status);
  const { source, dest } = pathfinder;

  async function executeSearch(algo, speed) {
    if(status === Status.Complete) {
      // clear the previous grid
      dispatch(clearGrid());
    }

    if(!algo) {
      return;
    }

    try {
      dispatch(setStatus(Status.Searching));
      const { parents, grid } = await dispatch(searchPath(algo, speed));
      await dispatch(highlightPath(grid, parents, speed))
      dispatch(setGrid({ grid }))
      dispatch(setStatus(Status.Complete))
    } catch(err) {
      // search is cancelled
    }
  }

  async function handleVisualize() {
    await executeSearch(AlgorithmsMap['bfs'].fn, 1)
  }

  async function handleClearGrid() {
    dispatch(clearGrid());
  }

  useEffect(() => {
    if(status === Status.Complete) {
      executeSearch(AlgorithmsMap['bfs'].fn, 0)
    }
  }, [source, dest])

  console.log("status: " + status);

  return (
    <section className={classes.controller}>
      <button onClick={handleVisualize} disabled={status === Status.Searching}>Visualize BFS</button>
      <button onClick={handleClearGrid} disabled={status === Status.Searching}>Clear Grid</button>
    </section>
  )
}

export default Controller