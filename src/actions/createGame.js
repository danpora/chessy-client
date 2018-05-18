import { RSAA } from 'redux-api-middleware';
import { setTimeout } from 'timers';
import { signToRoom, subscribeToGame } from '../service/socket';
// const CHESS_SERVER = 'localhost:8000/game'

export function createGame(myColor) {
  return (dispatch) => {
    dispatch(createGameRequest());

    return getNewGame()
      .then((response) => response.json())
      .then((json) => {
        const gameId = json.gameId;
        console.log('response', gameId);
        // TODO: check id validity
        dispatch({ type: 'CREATE_GAME::SUCCESS' });
        dispatch({ type: 'ROOM::SET_GAME_ID', payload: { gameId } });
        dispatch({ type: 'GAME::SET_MY_TURN', payload: { isMyTurn: true } });
        signToRoom(gameId, myColor);
        subscribeToGame(dispatch);
      })
      .catch((error) => {
        dispatch({ type: 'CREATE_GAME::FAILURE', payload: { error } });
      });
  };
}

function getNewGame() {
  return fetch('http://localhost:8000/game/createGame');
}

function createGameRequest() {
  return {
    type: 'CREATE_GAME::REQUEST',
  };
}
