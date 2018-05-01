import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

const initialState = {
  gameId: 0,
  socketId: 0,
  turn: 'white',
  isPeerConnected: false,
  players: {
    white: null,
    black: null
  }
}

export default handleActions({
  'ROOM::SET_GAME_ID' (state, action) {
    const { gameId } = action.payload

    return update(state, {
      gameId: { $set: gameId }
    })
  },

  'ROOM::SET_SOCKET_ID' (state, action) {
    const { socketId } = action.payload

    return update(state, {
      socketId: { $set: socketId }
    })
  },
  
  'ROOM::SET_ROOM_PLAYER' (state, action) {
    const { activePlayers } = action.payload
    const { socketId: mySocketId, players } = state
    const isPeerConnected = activePlayers.some(player => {
      return player.id !== mySocketId && player.id !== null
    })

    const updatedPlayers = activePlayers.reduce((acc, player) => {
      const { type, id } = player
      acc[type] = id

      return acc

    }, {})


    return update(state, {
      players: {
        $set: updatedPlayers
      },
      isPeerConnected: { $set: isPeerConnected }
    })
  }

}, initialState)