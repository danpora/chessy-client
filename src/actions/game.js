import { RSAA } from 'redux-api-middleware';
import * as SocketService from '../service/socket'
import room from '../reducers/room';
import { SERVER } from '../config'

export function initiateBoard(board) {
  return {
    type: 'GAME::INITIATE_BOARD',
    payload: { board }
  }
}

export function setSourceSelection(col, row, piece) {
  return {
    type: 'GAME::SET_SOURCE_SELECTION',
    payload: { col, row, piece }
  }
}

export function setTargetSelection(piece, col, row) {
  return {
    type: 'GAME::SET_TARGET_SELECTION',
    payload: { piece, col, row }
  }
}

export function setOrientation(orientation) {
  return {
    type: 'GAME::SET_ORIENTATION',
    payload: { orientation }
  }
}

export function move(roomId, socketId, description) {
  return dispatch => {
    return moveUpdate(roomId, socketId, description)
      .then(response => response.json())
      .then(json => {
        const isApproved = json.isApproved
        if (isApproved) {
          // dispatch({
          //   type: 'GAME::MOVE',
          //   payload: { description }
          // })
        } else {
          dispatch({
            type: 'GAME::MOVE_NOT_APPROVED'
          })
        }
      })
  }
}

export const setEatenPieces = selectedPiece => {
  return {
    type: 'GAME::SET_EATEN_PIECES',
    payload: { selectedPiece }
  }
}

export const iterate = (gameId, moveTo) => {
  debugger
  return {
    [RSAA]: {
      endpoint: `${SERVER}/game/${gameId}/board/${moveTo}`,
      method: 'GET',
      types: [
        {
          type: 'GAME::ITERATE_REQUEST', 
          meta: {moveTo}
        }, 
        {
          type: 'GAME::ITERATE_SUCCESS', 
          meta: {moveTo}
        }, 
        {
          type: 'GAME::ITERATE_FAILURE', 
          meta: {moveTo}
        }
      ]
    }
  }
}

export const rematchRequest = gameId => {
  return dispatch => {
    try {
      SocketService.rematchRequest(gameId)
      dispatch({ type: 'GAME::REMATCH_REQUEST_SENT'})
    } catch(e) {
      dispatch({ type: 'GAME::REMATCH_REQUEST_FAILED'})
    }
  }
}

export const rematchResponse = (roomId, response) => {
  return dispatch => {
    try {
      SocketService.rematchResponse(roomId, response)
    } catch(e) {
      dispatch({ type: 'GAME::REMATCH_REQUEST_FAILED'})
    }
  }
}

export const rematchCancel = roomId => {
  return dispatch => {
    try {
      SocketService.rematchCancel(roomId)
    } catch(e) {
      dispatch({ type: 'GAME::REMATCH_CANCEL_FAILED'})
    }
  }
}

const moveUpdate = (roomId, socketId, description) => {
  return fetch(`${SERVER}/game/move`, {
    method: 'POST',
    body: JSON.stringify({ roomId, socketId, description }),
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    json: true
  })
}

