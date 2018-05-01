import { PLAYER_COLOR_NUM } from '../../containers/game/constants'

export const isValidMove = (source, target) => {
  return true
}

export const isMyTurn = (moves, myColor) => {
  return (moves % 2) === PLAYER_COLOR_NUM[myColor]
}
