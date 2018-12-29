import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { BOARD_INDEXES, SQUARE_COLOR, NORMAL_BOARD_PARAMS } from './constants';
import { Square } from '../square';
import styles from './board.scss';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
  }

  componentDidMount = () => {
    this.updateBoardDimensions();
    window.addEventListener('resize', this.updateBoardDimensions);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateBoardDimensions);
  };

  updateBoardDimensions = () => {
    const gridHeight = this.gridRef.current.clientHeight;
    const gridWidth = this.gridRef.current.clientWidth;
    const sideLength =
      window.innerWidth < 750
        ? Math.max(gridHeight, gridWidth || gridHeight)
        : Math.min(gridHeight, gridWidth || gridHeight);

    this.gridRef.current.style.width = sideLength + 'px';
    this.gridRef.current.style.height = sideLength + 'px';
  };

  render() {
    const {
      className,
      matrix,
      orientation,
      onClick,
      highLightSelections,
      highLightOptions,
    } = this.props;
    const { orientedRowIndexes, orientedColIndexes } = getOrientedBoardIndexes(
      orientation,
    );

    const BoardGrid = () =>
      orientedRowIndexes.map((row) => {
        return orientedColIndexes.map((col) => {
          const squareColor = getSquareColor(col, row);
          const squareElements = matrix[row][col];
          const isSelected = highLightSelections.some((square) => {
            return square === `${col}${row}`;
          });
          const isOption = highLightOptions.some((square) => {
            return square === `${col}${row}`;
          });

          return (
            <Square
              key={`${row}${col}`}
              color={squareColor}
              elements={squareElements}
              location={{ row, col }}
              onClick={onClick}
              highlight={{ isSelected, isOption }}
            />
          );
        });
      });

    const loaderClass = this.props.isLoading.ownMove ? 'loader' : null;
    return (
      <div
        ref={this.gridRef}
        className={`${className} ${styles.boardContainer} ${
          styles[loaderClass]
        }`}
      >
        <BoardGrid />
        {
          this.props.isLoading.ownMove &&
          <div className={styles.moveLoader}>
            <FontAwesomeIcon
              icon={['fas', 'spinner']}
              size={'3x'}
              spin
            />
          </div>
        }
      </div>
    );
  }
}

const getOrientedBoardIndexes = (orientation) => ({
  orientedRowIndexes: orientation
    ? [...BOARD_INDEXES.row]
    : [...BOARD_INDEXES.row].reverse(),
  orientedColIndexes: orientation
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
  const squareIndexModulus = 1 - ((normalizedCol + normalizedRow) % 2);

  return SQUARE_COLOR[squareIndexModulus];
};

export default Board;
