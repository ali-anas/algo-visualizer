import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSingleCell } from '../../store/pathfinder.slice';
import { checkCellValid } from '../../helpers/pathfinder';


import classes from './grid.module.scss';
import { CELL_TYPE } from '../../constants';

const Grid = () => {
  const pathfinder = useSelector(state => state.pathfinder);
  const [element, setElement] = useState(null);
  const { isValidCell, selectedCell } = checkCellValid(element);
  const dispatch = useDispatch();
  const isMouseDown = useRef(false);
  const gridRef = useRef(null);
  const { grid } = pathfinder;
  console.log('pathfinder: ', pathfinder);

  useEffect(() => {
    if(!isValidCell) {
      return;
    }
    if(![CELL_TYPE.SOURCE, CELL_TYPE.DEST].includes(selectedCell.cellType)) {
      dispatch(updateSingleCell({ ...selectedCell, cellType: CELL_TYPE.WALL }));
    }

  }, [selectedCell, isValidCell]);
 
  const onMouseUp = (e) => {
    e.stopPropagation();
    if (isMouseDown.current) {
      isMouseDown.current = false;
    }
  }

  // onMouseDown
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(e.target) {
      setElement(e.target);
      isMouseDown.current = true;
    }
  }

  const onMouseMove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if(isMouseDown.current) {
      setElement(e.target);
    }
  }

  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) {
      return;
    }
    gridElement.addEventListener('mousedown', onMouseDown);
    gridElement.addEventListener('mousemove', onMouseMove);
    gridElement.addEventListener('mouseup', onMouseUp);
    return () => {
      gridElement.removeEventListener('mousedown', onMouseDown);
      gridElement.removeEventListener('mousemove', onMouseMove);
      gridElement.removeEventListener('mouseup', onMouseUp);
    }
  }, [gridRef]);

  console.log('grid: ', grid);

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
            ></button>
          )
        }
      )))}
    </div>
  )
}

export default Grid