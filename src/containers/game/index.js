import React from 'react';
import Board from '../../components/board';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/game';
import { getInitializedBoard } from '../../components/board/utils';
import { Button, Well, DropdownButton, MenuItem } from 'react-bootstrap';

import * as ChessEngine from './engine';
import * as Utils from './utils';
import styles from './game.scss';
import { Piece } from '../../components/piece';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCircle from '@fortawesome/fontawesome-free-solid/faCircle';

import {
  DialogRequestReceiver,
  DialogRequestSender,
} from '../../components/modal';
import Timer from '../../containers/timer';
import Chess from 'chess.js';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.engine = new Chess();
  }

  componentWillMount = () => {
    const initializedBoard = getInitializedBoard(this.props.matrix);
    this.props.actions.initiateBoard(initializedBoard);
  };

  onSquareClick = ({ ...targetSquareInfo }) => {
    const { myColor, mySelections } = this.props;
    const actionFlags = Utils.getActionFlags(
      targetSquareInfo.elements,
      myColor,
      mySelections,
    );

    this.moveActionSelector(actionFlags, targetSquareInfo);
  };

  moveActionSelector = (actionFlags, targetSquareInfo) => {
    const { col, row, elements: selectedPiece } = targetSquareInfo;
    const { isMyTurn } = this.props;

    if (!isMyTurn || actionFlags.isRedundantAction) {
      return;
    } else if (actionFlags.shouldUpdateOwnPieceSelection) {
      this.props.actions.setSourceSelection(col, row, selectedPiece);
      // this.props.actions.loadAvailableTargets(col, row, piece)
    } else if (actionFlags.shouldMoveToEmptySquare) {
      this.props.actions.setTargetSelection(selectedPiece, col, row);
      this.move(col, row, selectedPiece);
    } else if (actionFlags.shouldMoveToEnemySquare) {
      this.props.actions.setTargetSelection(selectedPiece, col, row);
      this.move(col, row, selectedPiece);
      // this.props.actions.setEatenPieces(selectedPiece)
    }
  };

  toggleOrientation = () => {
    const { orientation } = this.props;
    this.props.actions.setOrientation(!orientation);
  };

  move = (col, row, piece) => {
    const {
      mySelections: { source },
      socketId,
      roomId,
    } = this.props;
    const target = { col, row, piece };

    if (ChessEngine.isValidMove(source, target)) {
      this.props.actions.move(roomId, socketId, { source, target });
    }
  };

  rematch = () => {
    const { roomId } = this.props;
    this.props.actions.rematchRequest(roomId);
  };

  rematchResponse = (response) => {
    const { roomId } = this.props;
    this.props.actions.rematchResponse(roomId, response);
  };

  iterate = (offset) => {
    const { moves, roomId, history } = this.props;
    const moveTo = history.moves + offset;

    if (moveTo < 0 || moveTo > moves) return;

    this.props.actions.iterate(roomId, moveTo);
  };

  onRematchCancel = () => {
    const { roomId } = this.props;
    this.props.actions.rematchCancel(roomId);
  };

  render() {
    const highlightSquares = this.props.history.isIterating
      ? []
      : this.props.highlightSquares;

    return (
      <div className={styles.gameContainer}>
        <DialogRequestReceiver
          className={styles.dialog}
          show={this.props.rematch.received}
          response={this.rematchResponse}
        />
        <DialogRequestSender
          className={styles.dialog}
          show={this.props.rematch.sent}
          onRematchCancel={this.onRematchCancel}
        />
        <Board
          className={styles.board}
          matrix={this.props.matrix}
          onClick={this.onSquareClick}
          orientation={this.props.orientation}
          moveOptions={highlightSquares}
        />
        <DeadPool
          className={styles.deadPool}
          whites={this.props.eatenPieces.white}
          blacks={this.props.eatenPieces.black}
        />
        <ChessNav
          className={styles.nav}
          toggleOrientation={this.toggleOrientation}
          moves={this.props.moves}
          myColor={this.props.myColor}
          isPeerConnected={this.props.isPeerConnected}
          iterate={this.iterate}
          rematch={this.rematch}
          history={this.props.history}
          timer={this.props.startTime}
        />
        <GameTags
          className={styles.gameTags}
          moves={this.props.moves}
          myColor={this.props.myColor}
          isPeerConnected={this.props.isPeerConnected}
          history={this.props.history}
          timer={this.props.startTime}
        />
      </div>
    );
  }
}

function ChessNav({
  className,
  toggleOrientation,
  moves,
  iterate,
  history,
  rematch,
}) {
  return (
    <div className={className}>
      <ButtonsBox
        onClick={toggleOrientation}
        iterate={iterate}
        rematch={rematch}
        moves={moves}
        history={history}
      />
    </div>
  );
}

function ButtonsBox({ onClick, iterate, rematch }) {
  return (
    <div className={styles.controlBarContent}>
      <DropdownButton
        id={'gameMainDropDown'}
        bsStyle={'primary'}
        noCaret
        className={'dropdown-menu-left'}
        title={<FontAwesomeIcon icon={['fas', 'align-justify']} />}
      >
        <MenuItem eventKey="1" onClick={rematch}>
          Rematch
        </MenuItem>
        <MenuItem eventKey="2" onClick={iterate.bind(null, -1)}>
          Resign
        </MenuItem>
      </DropdownButton>
      <div className={styles.arrowsContainer}>
        <Button className={styles.arrows} onClick={iterate.bind(null, -1)}>
          <FontAwesomeIcon
            icon={['fas', 'arrow-left']}
            transform={'shrink-5'}
          />
        </Button>

        <Button className={styles.arrows} onClick={iterate.bind(null, 1)}>
          <FontAwesomeIcon
            icon={['fas', 'arrow-right']}
            transform={'shrink-5'}
          />
        </Button>
      </div>
      <Button
        bsStyle={'default'}
        className={styles.chessNavButton}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={['fab', 'nintendo-switch']} />
      </Button>
    </div>
  );
}

function GameTags({
  className,
  moves,
  myColor,
  isPeerConnected,
  history,
  timer,
}) {
  const connectionColor = isPeerConnected ? '#15c63c' : 'Tomato';
  const opponentColor = getOpponentColor(myColor);

  return (
    <div className={className}>
      <div className={styles.controlTagContainer}>
        <span className={styles.controlTagHeader}>Opponent</span>
        <span className={`fa-layers fa-fw ${styles.userIcon}`}>
          <div>
            <PlayerColorCircle playerColor={opponentColor} />
            <FontAwesomeIcon
              icon={faCircle}
              transform={'shrink-5 right-8 up-8'}
              style={{ color: connectionColor }}
            />
          </div>
        </span>
      </div>
      <div className={styles.controlTagContainer}>
        <span className={styles.controlTagHeader}>Moves</span>
        <span className={styles.controlTagValue}>
          {history.isIterating ? history.moves : moves}
        </span>
      </div>
      <div className={styles.controlTagContainer}>
        <span className={styles.controlTagHeader}>Time</span>
        <div className={styles.controlTagValue}>
          <Timer initTime={timer} />
        </div>
      </div>
    </div>
  );
}

const getOpponentColor = (myColor) => {
  return myColor === 'white' ? 'black' : 'white';
};

function PlayerColorCircle({ playerColor }) {
  const faStyle = playerColor === 'white' ? 'far' : 'fas';
  return <i className={`${faStyle} fa-circle fa-lg`}/>;
}

function DeadPool({ className, whites, blacks }) {
  return (
    <Well className={className}>
      <div className={styles.killedPiecesLine}>
        {whites.map((piece) => {
          return (
            <Piece
              key={piece.role}
              elements={{ role: piece.role, color: piece.color }}
              className={styles.killedPiece}
            />
          );
        })}
      </div>
      <div className={styles.killedPiecesLine}>
        {blacks.map((piece) => {
          return (
            <Piece
              key={piece.role}
              elements={{ role: piece.role, color: piece.color }}
              className={styles.killedPiece}
            />
          );
        })}
      </div>
    </Well>
  );
}

Game.propTypes = {
  actions: PropTypes.object.isRequired,
  matrix: PropTypes.object.isRequired,
  orientation: PropTypes.any.isRequired,
  myColor: PropTypes.string.isRequired,
  isMyTurn: PropTypes.bool.isRequired,
  roomPlayers: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    matrix: state.game.matrix,
    mySelections: state.game.mySelections,
    myColor: state.game.myColor,
    orientation: state.game.orientation,
    isMyTurn: state.game.isMyTurn,
    roomId: state.room.gameId,
    roomPlayers: state.room.players,
    socketId: state.room.socketId,
    moves: state.game.moves,
    isPeerConnected: state.room.isPeerConnected,
    eatenPieces: state.game.eatenPieces,
    history: state.game.history,
    rematch: state.game.rematch,
    moveOptions: state.game.moveOptions,
    highlightSquares: state.game.highlightSquares,
    startTime: state.game.startTime,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
