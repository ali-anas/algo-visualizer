export const CELL_TYPE = {
  SOURCE: 1,
  DEST: 2,
  WALL: 3,
  EMPTY: 0,
  VISITED: 4,
  PATH: 5,
  PATH_H: 6,
  PATH_V: 7,
  PATH_TL: 8,
  PATH_TR: 9,
  PATH_BL: 10,
  PATH_BR: 11,
}


export const Status = {
  Ready: 'ready',
  Complete: 'complete',
  Generating: 'generating',
  Searching: 'searching',
}

export const CELL_SIZE = 25;