import { combineReducers } from 'redux';
import game from './game';
import createGame from './createGame'
import joinGame from './joinGame'
import room from './room'
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  game,
  room,
  createGame,
  joinGame,
  routing: routerReducer
});

export default rootReducer;
