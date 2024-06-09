import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useMouse from '../../hooks/useMouse';


import classes from './grid.module.scss';
import { Status } from '../../constants';

const Grid = () => {
  const pathfinder = useSelector(state => state.pathfinder);
  const gridRef = useRef(null);
  const { grid, status } = pathfinder;

  useMouse({ gridRef });

  const gridStyle = { display: 'grid', gridTemplateColumns: `repeat(${grid[0].length}, 25px)`, gridTemplateRows: `repeat(${grid.length}, 25px)` }
  return (
    <div style={gridStyle} className={classes.grid} ref={gridRef}>
      {grid.map((row, rowIndex) => (
        row.map((cellType, colIndex) => {
          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={classes[`type-${cellType}`]}
              data-col={colIndex}
              data-row={rowIndex}
              data-cell-type={cellType}
              disabled={status === Status.Searching}
            ></button>
          )
        }
      )))}
    </div>
  )
}

export default Grid