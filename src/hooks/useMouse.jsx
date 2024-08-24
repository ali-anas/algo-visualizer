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
  const prevCellRef = useRef(null);
  // CELL_TYPE.SOURCE and CELL_TYPE.DEST need support for dragging.
  const draggableCellRef = useRef(null);

  useEffect(() => {
    // if mouse up event is triggered, set the previously selected draggable cell to null.
    if(!isMouseDown.current) {
      draggableCellRef.current = null;
      prevCellRef.current = null;
    }
  }, [isMouseDown.current])

  useEffect(() => {
    if(!isValidCell) {
      return;
    }

    if (draggableCellRef.current) {
      // if selected cell is draggable and current cell is not either wall or source or destination cell already then
      // then change current cell to the type of draggable cell
      // i.e change position of source or destination
      if(![CELL_TYPE.SOURCE, CELL_TYPE.DEST, CELL_TYPE.WALL].includes(selectedCell.cellType)) {
        dispatch(updateSingleCell({ ...selectedCell, cellType: draggableCellRef.current.cellType }));
      }
      return;
    }

    // if cell type is CELL_TYPE.SOURCE or CELL_TYPE.DEST mark it as draggable
    if ([CELL_TYPE.SOURCE, CELL_TYPE.DEST].includes(selectedCell.cellType)) {
      draggableCellRef.current = selectedCell;
      return;
    }

    // toggle the empty and wall cells
    const sameAsPrev = prevCellRef.current?.row === selectedCell.row && prevCellRef.current?.col === selectedCell.col;
    if(!sameAsPrev) {
      dispatch(updateSingleCell({ ...selectedCell, cellType: selectedCell.cellType === CELL_TYPE.WALL ? CELL_TYPE.EMPTY : CELL_TYPE.WALL }));
      prevCellRef.current = selectedCell;
    }

  }, [selectedCell, isValidCell]);
 
  const onMouseUp = () => {
    isMouseDown.current = false;
    setElement(null);
  }

  // onMouseDown
  const onMouseDown = (e) => {
    if(e.target) {
      setElement(e.target);
      isMouseDown.current = true;
    }
  }

  const onMouseMove = (e) => {
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