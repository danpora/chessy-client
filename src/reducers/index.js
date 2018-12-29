import { combineReducers } from 'redux';
import game from '../containers/game/reducer';
import createGame from '../containers/create-game/reducer';
import joinGame from '../containers/join-game/reducer'
import room from './room'
import { routerReducer } from 'react-router-redux';

const appReducer = combineReducers({
  game,
  room,
  createGame,
  joinGame,
  routing: routerReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'RESTART_APP') {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;
