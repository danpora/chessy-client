import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

const initialState = {
  isPeerConnected: false,
  isGameCreated: false,
  isFetching: false, 
}

export default handleActions({

  'CREATE_GAME::REQUEST' (state, action) {
    return update(state, {
      isFetching: { $set: true }
    })
  },

  'CREATE_GAME::SUCCESS' (state, action) {
    return update(state, {
      isFetching: { $set: false },
      isGameCreated: { $set: true }
    })
  },

  'CREATE_GAME::SHOULD_START_GAME' (state, action) {
    return update(state, {
      isPeerConnected: { $set: true },
      isGameCreated: { $set: false }
    })
  }

}, initialState)