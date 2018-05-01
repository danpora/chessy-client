import update from 'react-addons-update'
import { handleActions } from 'redux-actions'
import { ORIENTATION } from '../containers/game/constants'
import { PLAYER_COLOR_NUM } from '../containers/game/constants'
import { getPieceState } from '../components/piece'
import { getEmptyBoard, getInitializedBoard } from '../components/board/utils'
import * as ChessEngine from '../containers/game/engine'

const initialMySelection = {
  count: 0,
  source: null,
  target: null,
}

const initialState = {
  matrix: getEmptyBoard(),
  orientation: PLAYER_COLOR_NUM['white'],
  myColor: 'white',
  isMyTurn: false,
  mySelections: initialMySelection,
  moves: 0,
  moveOptions: [],
  highlightSquares: [],
  startTime: 0,
  rematch: {
    sent: false,
    received: false,
    approved: false
  },
  history: {
    isIterating: false,
    move: 0
  },
  loading: {
    board: false
  },
  eatenPieces: {
    white: [],
    black: []
  }
}

const emptySquare = null

export default handleActions({

  'GAME::SET_ORIENTATION'(state, action) {
    const { orientation } = action.payload

    return update(state, {
      orientation: { $set: orientation }
    })
  },

  'GAME::SET_OWN_COLOR'(state, action) {
    const { ownColor } = action.payload

    return update(state, {
      myColor: {
        $set: ownColor
      }
    })
  },

  'GAME::SET_MY_TURN'(state, action) {
    const { isMyTurn } = action.payload
    return update(state, {
      isMyTurn: {
        $set: isMyTurn
      }
    })
  },

  'GAME::SET_SOURCE_SELECTION'(state, action) {
    const { col, row, piece } = action.payload

    return update(state, {
      mySelections: {
        count: { $set: 1 },
        source: {
          $set: {
            ...piece,
            location: {
              col,
              row
            }
          }
        },
        target: { $set: emptySquare }
      },
      highlightSquares: { $set: [`${col}${row}`] }
    })
  },

  'GAME::SET_TARGET_SELECTION'(state, action) {
    const { piece, col, row } = action.payload

    return update(state, {
      count: { $set: 1 },
      mySelections: {
        target: { $set: piece }
      },
      highlightSquares: {
        $push: [`${col}${row}`]
      }
    })
  },

  'GAME::SET_MOVES_COUNT'(state, action) {
    const { updatedMoves } = action.payload
    const { history } = state
    const isMyTurn = ChessEngine.isMyTurn(updatedMoves, state.myColor)
    const updatedHistoryMoves = history.isIterating ? history.moves : updatedMoves

    return update(state, {
      isMyTurn: { $set: isMyTurn },
      moves: { $set: updatedMoves },
      history: {
        moves: { $set: updatedHistoryMoves }
      }
    })
  },

  'GAME::MOVE'(state, action) {
    const { description: { source, target } } = action.payload
    const { isMyTurn, myColor, moves, history } = state

    let hightlightSquareUpdate = state

    if (!isMyTurn) {
      hightlightSquareUpdate = update(hightlightSquareUpdate, {
        highlightSquares: { $set: [] }
      })
    }

    let updateEatenPieceState = hightlightSquareUpdate

    if (target.piece) {
      updateEatenPieceState = update(updateEatenPieceState, {
        eatenPieces: {
          [target.piece.color]: {
            $push: [target.piece]
          }
        }
      })
    }

    if (history.isIterating) {
      return updateEatenPieceState
    }

    const targetUpdatedState = update(updateEatenPieceState, {
      matrix: {
        [target.row]: {
          [target.col]: {
            $set: getPieceState(source.role, source.color)
          }
        }
      },
      mySelections: {
        $set: initialMySelection
      }
    })

    const sourceUpdatedState = update(targetUpdatedState, {
      matrix: {
        [source.location.row]: {
          [source.location.col]: {
            $set: emptySquare
          }
        },
      }
    })

    return sourceUpdatedState
  },

  'GAME::SET_EATEN_PIECES'(state, action) {
    const { selectedPiece: piece } = action.payload

    return update(state, {
      eatenPieces: {
        [piece.color]: {
          $push: [piece]
        }
      }
    })
  },

  'GAME::ITERATE_REQUEST' (state, action) {
    return update(state, {
      loading: {
        board: {
          $set: true
        }
      }
    })
  },

  'GAME::ITERATE_FAILURE' (state, action) {
    return update(state, {
      loading: {
        board: {
          $set: false
        }
      }
    })
  },

  'GAME::ITERATE_SUCCESS' (state, action) {
    const { board } = action.payload
    const { moveTo } = action.meta
    const { moves } = state
    const isIterating = moves !== moveTo

    return update(state, {
      matrix: { $set: board },
      history: {
        isIterating: { $set: isIterating },
        moves: { $set: moveTo }
      },
      loading: {
        board: {
          $set: false
        }
      }
    })
  },

  'GAME::REMATCH_REQUEST_RECEIVED' (state, action) {
    return update(state, {
      rematch: {
        received: { $set: true }
      }
    })
  },

  'GAME::REMATCH_REQUEST_SENT' (state, action){
    return update(state, {
      rematch: {
        sent: { $set: true }
      }
    })
  },

  'GAME::REMATCH_CANCEL_REQUEST' (state, action) {
    return update(state, {
      rematch: {
        sent: { $set: false },
        received: { $set: false }
      }
    })
  },

  'GAME::REMATCH_RESPONSE_RECEIVED' (state, action) {
    const { response } = action.payload
    const { myColor } = state

    if (!response) {
      return update(state, {
        rematch: {
          received: { $set: false },
          sent: { $set: false }
        }
      })
    }

    return update(initialState, {
      orientation: { $set: PLAYER_COLOR_NUM[myColor] },
      matrix: { $set: getInitializedBoard(getEmptyBoard())},
      myColor: { $set: myColor },
      startTime: { $set: Date.now() }
    })
  },

  'GAME::INIT_TIMER' (state, action) {
    return update(state, {
      startTime: { $set: Date.now() }
    })
  },

  'GAME::INITIATE_BOARD'(state, action) {
    const { board } = action.payload

    return update(state, {
      matrix: {
        $set: board
      }
    })
  }

}, initialState)