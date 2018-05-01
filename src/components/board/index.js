import React from 'react';
import { BOARD_INDEXES, SQUARE_COLOR, NORMAL_BOARD_PARAMS } from './constants';
import { Square } from '../square';
import styles from './board.css';

const Board = (props) => {
  const { matrix, orientation, onClick, moveOptions } = props
  const { orientedRowIndexs, orientedColIndexs } = getOrientedBoardIndexes(orientation)

  return orientedRowIndexs.map(row => {    
    return (
      <BoardRow key={row} id={row}>
        {
          orientedColIndexs.map(col => {
            const squareColor = getSquareColor(col, row)
            const squareElements = matrix[row][col]
            const shouldHighlight = moveOptions
              .some(square => {
                return square === `${col}${row}`
              })
            
            return (
              <Square
                key={`${row}${col}`}
                color={squareColor}
                elements={squareElements}
                location={{ row, col }}
                onClick={onClick}
                highlight={shouldHighlight}
              />
            )
          })
        }
      </BoardRow>
    )
  })
}

export default Board;


const BoardRow = (props) => {  
  return (
    <div
      id={`${props.id}`}
      className={styles.row}    
    >
     {props.children}
    </div>
  )
}


const getOrientedBoardIndexes = (orientation) => ({
  orientedRowIndexs: orientation ? [...BOARD_INDEXES.row] : [...BOARD_INDEXES.row].reverse(),
  orientedColIndexs: orientation ? [...BOARD_INDEXES.col].reverse() : [...BOARD_INDEXES.col]
})

// Map ASCII 'a' to 1, 'b' to 2 and so on
const getNormalizedSquareLocation = (col, row) => ({
  normalizedCol: col.charCodeAt() - NORMAL_BOARD_PARAMS.col,
  normalizedRow: row.charCodeAt() - NORMAL_BOARD_PARAMS.row
})

const getSquareColor = (col, row) => {
  const { normalizedRow, normalizedCol } = getNormalizedSquareLocation(col, row)
  const squareIndexModulus = 1 - (normalizedCol + normalizedRow) % 2

  return SQUARE_COLOR[squareIndexModulus]
}
