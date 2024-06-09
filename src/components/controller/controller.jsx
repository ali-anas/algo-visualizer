import React, { useState, useEffect } from 'react'
import { AlgorithmsMap } from '../../lib/algorithms'
import { useSelector, useDispatch } from 'react-redux'
import { clearGrid, setStatus, setGrid } from '../../store/pathfinder.slice'
import { searchPath } from '../../store/searchPath.thunk'
import { Status } from '../../constants'
import { highlightPath } from '../../store/highlight.thunk'
import classes from './controller.module.scss';
import { Play, RefreshCcw , Trash} from 'lucide-react'


const Controller = () => {
  const [selectedAlgo, setSelectedAlgo] = useState('');
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

  async function handleAlgoSelection(e) {
    const algo = e.target.value;
    setSelectedAlgo(algo);
    await executeSearch(AlgorithmsMap[algo].fn, 1);
  }

  return (
    <section className={classes.controller}>
      <div className={classes.controls}>
        <button
          onClick={handleVisualize}
          disabled={status === Status.Searching || !selectedAlgo}
          data-tooltip="Play"
        >
          <Play size={20} stroke={status === Status.Searching || !selectedAlgo ? "#949494" : "#111111"}/>
        </button>
        <button
          onClick={handleClearGrid}
          disabled={status === Status.Searching}
          data-tooltip="Clear">
          <Trash size={20} stroke={status === Status.Searching ? "#949494" : "#111111"}/>
        </button>
      </div>
      <select className={classes.algoSelector} value={selectedAlgo} onChange={handleAlgoSelection} disabled={status === Status.Searching}>
        <option value="" disabled>
          Select an algorithm
        </option>
        {[...Object.entries(AlgorithmsMap)].map(([key, { name }]) => <option key={key} value={key}>{name}</option>)}
      </select>
    </section>
  )
}

export default Controller