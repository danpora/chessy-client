import { signToRoom, subscribeToGame } from '../service/socket'
import { PLAYER_COLOR_NUM } from '../containers/game/constants'
import { SERVER } from '../config'

export function updateGameId(gameId) {
  return {
    type: 'JOIN_GAME::UPDATE_GAME_ID',
    payload: { gameId }
  }
}

export function joinGame(gameId) {
  return dispatch => {
    dispatch(joinGameRequest())

    return validateGameEntry(gameId)
      .then(response => response.json())
      .then(json => {
        const { isValidate, playerColor } = json
        if (json.isValidate) {
          dispatch({ type: 'JOIN_GAME::APPROVED' })
          dispatch({ type: 'ROOM::SET_GAME_ID', payload: { gameId } })
          dispatch({ type: 'GAME::SET_OWN_COLOR', payload: { ownColor: playerColor } })
          dispatch({
            type: 'GAME::SET_ORIENTATION',
            payload: { orientation: PLAYER_COLOR_NUM[playerColor] } 
          })
          dispatch({ type: 'GAME::INIT_TIMER' })

          signToRoom(gameId, playerColor)
          subscribeToGame(dispatch)

        } else {
          dispatch({ type: 'JOIN_GAME::DISAPPROVED ' })
        }
      })

      .catch(err => {
        dispatch({ type: 'JOIN_GAME::ERROR' })
      })
  }
}

const joinGameRequest = () => {
  return {
    type: 'JOIN_GAME::REQUEST'
  }
}

const validateGameEntry = (gameId) => {
  return fetch(`${SERVER}/game/validateEntry?gameId=${gameId}`)
}