import io from 'socket.io-client'
import room from '../reducers/room';

export const subscribeToGame = (dispatch) => {
  dispatch({ type: 'ROOM::SET_SOCKET_ID', payload: { socketId: socket.id}})  
  
  socket.on('connect', () => {
    dispatch({ type: 'ROOM::SET_SOCKET_ID', payload: { socketId: socket.id}})  
  })
  
  socket.on('start', payload => {
    console.log('START!!')
    
    dispatch({ type: 'CREATE_GAME::SHOULD_START_GAME'})
    dispatch({ type: 'GAME::INIT_TIMER' })
  })
  
  socket.on('updatePlayerMove', description => {
    dispatch({ type: 'GAME::MOVE', payload: { description } })
  })

  socket.on('updatedMovesCount', updatedMoves => {
    dispatch({ type: 'GAME::SET_MOVES_COUNT', payload: { updatedMoves } })
  })

  socket.on('setRoomPeer', activePlayers => {
    dispatch({ type: 'ROOM::SET_ROOM_PLAYER', payload: { activePlayers } })
  })

  socket.on('setOwnTurn', isMyTurn => {
    dispatch({ type: 'GAME::SET_MY_TURN', payload: { isMyTurn } })
  })

  socket.on('rematchRequest', () => {
    dispatch({ type: 'GAME::REMATCH_REQUEST_RECEIVED'})
  })

  socket.on('rematchResponse', response => {
    console.log('--rematchResponse!--')
    dispatch({ type: 'GAME::REMATCH_RESPONSE_RECEIVED', payload: { response }})
    dispatch({ type: 'GAME::INIT_TIMER' })
  })

  socket.on('rematchCancel', () => {
    dispatch({ type: 'GAME::REMATCH_CANCEL_REQUEST' })
  })
}

export const rematchRequest = roomId => {
  socket.emit('rematchRequest', roomId)
}

export const rematchResponse = (roomId, response) => {
  socket.emit('rematchResponse', roomId, response)
}

export const rematchCancel = roomId => {
  socket.emit('rematchCancel', roomId)
}

export const signToRoom = (roomId, color) => {
  global.socket = io('http://localhost:8000')
  socket.emit('sign', roomId, color)
}

