import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkCellValid } from '../helpers/pathfinder';
import { updateSingleCell } from '../store/pathfinder.slice';
import { CELL_TYPE } from '../constants';

const useMouse = ({ gridRef }) => {
  const [element, setElement] = useState(null);
  const { isValidCell, selectedCell } = checkCellValid(element);
  const dispatch = useDispatch();
  const isMouseDown = useRef(false);
  const draggableCellRef = useRef(null);

  useEffect(() => {
    if(!isMouseDown.current) {
      draggableCellRef.current = null;
    }
  }, [isMouseDown.current])

  useEffect(() => {
    if(!isValidCell) {
      return;
    }

    if (draggableCellRef.current) {
      if(![CELL_TYPE.SOURCE, CELL_TYPE.DEST, CELL_TYPE.WALL].includes(selectedCell.cellType)) {
        dispatch(updateSingleCell({ ...selectedCell, cellType: draggableCellRef.current.cellType }));
      }
      return;
    }

    if ([CELL_TYPE.SOURCE, CELL_TYPE.DEST].includes(selectedCell.cellType)) {
      draggableCellRef.current = selectedCell;
      return;
    }

    if(![CELL_TYPE.SOURCE, CELL_TYPE.DEST].includes(selectedCell.cellType)) {
      dispatch(updateSingleCell({ ...selectedCell, cellType: selectedCell.cellType === CELL_TYPE.WALL ? CELL_TYPE.EMPTY : CELL_TYPE.WALL }));
    }

  }, [selectedCell, isValidCell]);
 
  const onMouseUp = (e) => {
    e.stopPropagation();
    isMouseDown.current = false;
    setElement(null);
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
};

export default useMouse;