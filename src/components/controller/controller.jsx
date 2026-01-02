import React, { useState, useEffect } from 'react'
import { AlgorithmsMap } from '../../lib/algorithms'
import { useSelector, useDispatch } from 'react-redux'
import { clearGrid, setStatus, setGrid, setVisitedCells, setPathLength } from '../../store/pathfinder.slice'
import { searchPath } from '../../store/searchPath.thunk'
import { Status } from '../../constants'
import { highlightPath } from '../../store/highlight.thunk'
import classes from './controller.module.scss';
import { Play, Trash } from 'lucide-react'
import { clearGridData } from '../../helpers/pathfinder'


const Controller = () => {
  const [selectedAlgo, setSelectedAlgo] = useState('');
  const dispatch = useDispatch();
  const pathfinder = useSelector(state => state.pathfinder);
  const status = useSelector(state => state.pathfinder.status);
  const { source, dest, visitedCells, pathLength } = pathfinder;

  async function executeSearch(algo, speed) {
    if (speed === 0) {
      // Optimized path for drag and drop
      const cleanedGrid = clearGridData(pathfinder.grid);
      const { parents, grid } = await dispatch(searchPath(algo, speed, cleanedGrid));
      await dispatch(highlightPath(grid, parents, speed));
      dispatch(setGrid({ grid }));
      return;
    }

    if (status === Status.Complete) {
      // clear the previous grid
      dispatch(clearGrid());
    }

    if (!algo) {
      return;
    }

    try {
      dispatch(setPathLength(0));
      dispatch(setVisitedCells(0))
      dispatch(setStatus(Status.Searching));
      const { parents, grid } = await dispatch(searchPath(algo, speed));
      await dispatch(highlightPath(grid, parents, speed))
      dispatch(setGrid({ grid }))
      dispatch(setStatus(Status.Complete))
    } catch (err) {
      console.error("Search failed or cancelled:", err);
      dispatch(setStatus(Status.Complete));
    }
  }

  async function handleVisualize() {
    if (!selectedAlgo) {
      return;
    }
    await executeSearch(AlgorithmsMap[selectedAlgo].fn, 1)
  }

  async function handleClearGrid() {
    dispatch(clearGrid());
    dispatch(setVisitedCells(0));
    dispatch(setPathLength(0));
  }

  useEffect(() => {
    if (status === Status.Complete) {
      const handler = setTimeout(() => {
        executeSearch(AlgorithmsMap[selectedAlgo].fn, 0)
      }, 50); // Small debounce for drag
      return () => clearTimeout(handler);
    }
  }, [source, dest])

  async function handleAlgoSelection(e) {
    const algo = e.target.value;
    setSelectedAlgo(algo);
    await executeSearch(AlgorithmsMap[algo].fn, 1);
  }

  return (
    <section className={classes.controller}>
      <div className={classes.controls + " controls"}>
        <button
          onClick={handleVisualize}
          disabled={status === Status.Searching || !selectedAlgo}
          data-tooltip="Play"
        >
          <Play size={20} stroke={status === Status.Searching || !selectedAlgo ? "#949494" : "#111111"} />
        </button>
        <button
          onClick={handleClearGrid}
          disabled={status === Status.Searching}
          data-tooltip="Clear">
          <Trash size={20} stroke={status === Status.Searching ? "#949494" : "#111111"} />
        </button>
      </div>
      <div className={classes.stats}>
        <div>
          <span className={classes.statsField}>Visited Cells: {visitedCells}</span>{' '}
          <span className={classes.statsField}>Path Length: {pathLength}</span>
        </div>
      </div>
      <select className={classes.algoSelector + " algo-selector"} value={selectedAlgo} onChange={handleAlgoSelection} disabled={status === Status.Searching}>
        <option value="" disabled>
          Select an algorithm
        </option>
        {[...Object.entries(AlgorithmsMap)].map(([key, { name }]) => <option key={key} value={key}>{name}</option>)}
      </select>
    </section>
  )
}

export default Controller