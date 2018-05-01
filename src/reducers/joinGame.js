import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

const initialState = {
  gameId: 0,
  shouldRedirectToGame: false,
  loading: false
}

export default handleActions({
  'JOIN_GAME::UPDATE_GAME_ID' (state, action) {
    const { gameId } = action.payload
    
    return update(state, {
      gameId: { $set: gameId }
    })
  },

  'JOIN_GAME::REQUEST' (state, action) {
    return update(state, {
      loading: { $set: true }
    })
  },

  'JOIN_GAME::APPROVED' (state, action) {
    return update(state, {
      shouldRedirectToGame: { $set: true },
      loading: { $set: false }
    })
  }

}, initialState)