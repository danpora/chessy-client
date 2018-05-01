import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

const initialState = {
  gameId: 0,
  peerConnected: false,
  isWaitingForPeer: false,
  loading: false
}

export default handleActions({

  'CREATE_GAME::REQUEST' (state, action) {
    return update(state, {
      loading: { $set: true }
    })
  },

  'CREATE_GAME::SUCCESS' (state, action) {
    return update(state, {
      loading: { $set: false },
      isWaitingForPeer: { $set: true }
    })
  },

  'CREATE_GAME::SHOULD_START_GAME' (state, action) {
    return update(state, {
      peerConnected: { $set: true },
      isWaitingForPeer: { $set: false }
    })
  }

}, initialState)