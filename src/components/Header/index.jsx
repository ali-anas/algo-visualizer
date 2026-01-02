import React from 'react';
import { CELL_TYPE } from '../../constants';
import AppTour from '../AppTour'
import classes from './header.module.scss'

const Header = () => {
  return (
    <div className={classes.header}>
      <h1>Path Finder</h1>
      <AppTour />
      <div className={classes.cellInfo}>
        {Object.keys(CELL_TYPE).map(cellType => {
          if (cellType === 'EMPTY' || ['PATH_H', 'PATH_V', 'PATH_TL', 'PATH_TR', 'PATH_BL', 'PATH_BR'].includes(cellType)) {
            return null;
          }
          const text = cellType.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
          return (
            <div key={cellType} className={classes.cellItem}>
              <div className={classes.cell} data-color={cellType.toLowerCase()} style={{ backgroundColor: `var(--${cellType.toLowerCase()})` }} />
              <span>{text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Header;