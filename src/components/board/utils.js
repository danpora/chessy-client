import update from 'react-addons-update';
import { getPieceState } from '../../components/piece'
import { BOARD_INDEXES } from './constants'

export const getEmptyBoard = () => {
  const board = {};

  for (let row of BOARD_INDEXES.row) {
    board[row] = {};
  }

  for (let row of BOARD_INDEXES.row) {
    for (let col of BOARD_INDEXES.col) {
      board[row][col] = null
    }
  }

  return board;
};

export const getInitializedBoard = (emptyBoard) => {
  const initBoard = update(emptyBoard, {
    ['1']: {
      ['a']: { $set: getPieceState('rook', 'white')},
      ['b']: { $set: getPieceState('knight', 'white')},
      ['c']: { $set: getPieceState('bishop', 'white') },
      ['d']: { $set: getPieceState('queen', 'white')} ,
      ['e']: { $set: getPieceState('king', 'white')} ,
      ['f']: { $set: getPieceState('bishop', 'white')},
      ['g']: { $set: getPieceState('knight', 'white') },
      ['h']: { $set: getPieceState('rook', 'white') }
    } ,
    ['2']: {
      ['a']: { $set: getPieceState('pawn', 'white') },
      ['b']: { $set: getPieceState('pawn', 'white') },
      ['c']: { $set: getPieceState('pawn', 'white') },
      ['d']: { $set: getPieceState('pawn', 'white') },
      ['e']: { $set: getPieceState('pawn', 'white') },
      ['f']: { $set: getPieceState('pawn', 'white') },
      ['g']: { $set: getPieceState('pawn', 'white') },
      ['h']: { $set: getPieceState('pawn', 'white') }
    } ,
    ['8']: {
      ['a']: { $set: getPieceState('rook', 'black')},
      ['b']: { $set: getPieceState('knight', 'black')},
      ['c']: { $set: getPieceState('bishop', 'black') },
      ['d']: { $set: getPieceState('queen', 'black')} ,
      ['e']: { $set: getPieceState('king', 'black')} ,
      ['f']: { $set: getPieceState('bishop', 'black')},
      ['g']: { $set: getPieceState('knight', 'black') },
      ['h']: { $set: getPieceState('rook', 'black') }
    } ,
    ['7']: {
      ['a']: { $set: getPieceState('pawn', 'black')},
      ['b']: { $set: getPieceState('pawn', 'black') },
      ['c']: { $set: getPieceState('pawn', 'black') },
      ['d']: { $set: getPieceState('pawn', 'black') },
      ['e']: { $set: getPieceState('pawn', 'black') },
      ['f']: { $set: getPieceState('pawn', 'black') },
      ['g']: { $set: getPieceState('pawn', 'black') },
      ['h']: { $set: getPieceState('pawn', 'black') }
    } ,
  })

return initBoard
}