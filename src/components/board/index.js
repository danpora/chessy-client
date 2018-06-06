import React from 'react';
import { BOARD_INDEXES, SQUARE_COLOR, NORMAL_BOARD_PARAMS } from './constants';
import { Square } from '../square';
import styles from './board.scss';

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.gridRef = React.createRef();
  }

  componentDidMount = () => {
    this.updateBoardDimensions();
    window.addEventListener('resize', this.updateBoardDimensions);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateBoardDimensions)
  }

  updateBoardDimensions = () => {
    console.log('resize')
    const gridHeight = this.gridRef.current.clientHeight;
    const gridWidth = this.gridRef.current.clientWidth;
    const sideLength = window.innerWidth < 750 
    ? Math.max(gridHeight, gridWidth || gridHeight)
    : Math.min(gridHeight, gridWidth || gridHeight)
    
    this.gridRef.current.style.width = sideLength + 'px';
    this.gridRef.current.style.height = sideLength + 'px';
  }

  render() {
    const { className, matrix, orientation, onClick, moveOptions } = this.props;
    const { orientedRowIndexs, orientedColIndexs } = getOrientedBoardIndexes(
      orientation,
    );
    
    const BoardGrid = () =>
      orientedRowIndexs.map((row) => {
        return orientedColIndexs.map((col) => {
          const squareColor = getSquareColor(col, row);
          const squareElements = matrix[row][col];
          const shouldHighlight = moveOptions.some((square) => {
            return square === `${col}${row}`;
          });

          return (
            <Square
              key={`${row}${col}`}
              color={squareColor}
              elements={squareElements}
              location={{ row, col }}
              onClick={onClick}
              highlight={shouldHighlight}
            />
          );
        });
      });

    return (
      <div ref={this.gridRef} className={`${className} ${styles.boardContainer}`}>
        <BoardGrid />
      </div>
    );
  }
}

export default Board;

const BoardRow = (props) => {
  return props.children;
};

const getOrientedBoardIndexes = (orientation) => ({
  orientedRowIndexs: orientation
    ? [...BOARD_INDEXES.row]
    : [...BOARD_INDEXES.row].reverse(),
  orientedColIndexs: orientation
    ? [...BOARD_INDEXES.col].reverse()
    : [...BOARD_INDEXES.col],
});

// Map ASCII 'a' to 1, 'b' to 2 and so on
const getNormalizedSquareLocation = (col, row) => ({
  normalizedCol: col.charCodeAt() - NORMAL_BOARD_PARAMS.col,
  normalizedRow: row.charCodeAt() - NORMAL_BOARD_PARAMS.row,
});

const getSquareColor = (col, row) => {
  const { normalizedRow, normalizedCol } = getNormalizedSquareLocation(
    col,
    row,
  );
  const squareIndexModulus = 1 - (normalizedCol + normalizedRow) % 2;

  return SQUARE_COLOR[squareIndexModulus];
};
