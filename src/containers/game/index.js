import React from 'react';
import Board from '../../components/board';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/game';
import {
  getEmptyBoard,
  getInitializedBoard,
} from '../../components/board/utils';
import {
  Button,
  ButtonGroup,
  Label,
  Row,
  Col,
  Grid,
  Well,
} from 'react-bootstrap';
import * as ChessEngine from './engine';
import * as Utils from './utils';
import styles from './game.scss';
import classnames from 'classnames';
import { Piece } from '../../components/piece';
import { PLAYER_COLOR_NUM } from './constants';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { rematch } from '../../service/socket';
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
        {/* <div className={styles.board} /> */}
        <div className={styles.deadPool} />
        <div className={styles.nav} />
        {/* <DeadPool
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
          /> */}
      </div>
    );
  }
}

function ChessNav({
  className,
  toggleOrientation,
  moves,
  myColor,
  isPeerConnected,
  iterate,
  history,
  rematch,
  timer,
}) {
  return (
    <div className={className}>
      {/* <ButtonsBox
        onClick={toggleOrientation}
        iterate={iterate}
        rematch={rematch}
        moves={moves}
        history={history}
      />
      <GameTags
        moves={moves}
        myColor={myColor}
        isPeerConnected={isPeerConnected}
        history={history}
        timer={timer}
      /> */}
    </div>
  );
}

function ButtonsBox({ onClick, iterate, rematch, moves, history }) {
  return (
    <div className={styles.controlBarContent}>
      <Button bsClass={styles.chessNavButton} onClick={onClick}>
        <FontAwesomeIcon
          icon={['fab', 'nintendo-switch']}
          transform={'shrink-5'}
          size={'2x'}
        />
        <span className={styles.chessNavButtonText}>Orientation</span>
      </Button>
      <Button bsClass={styles.chessNavButton}>
        <FontAwesomeIcon
          icon={['fas', 'window-close']}
          transform={'shrink-5'}
          size={'2x'}
        />
        <span className={styles.chessNavButtonText}> Resign </span>
      </Button>
      <Button bsClass={styles.chessNavButton} onClick={rematch}>
        <FontAwesomeIcon
          icon={['fas', 'redo-alt']}
          transform={'shrink-5'}
          size={'2x'}
        />
        <span className={styles.chessNavButtonText}> Rematch </span>
      </Button>
      <div className={styles.arrowsContainer}>
        <div className={styles.arrows} onClick={iterate.bind(null, -1)}>
          <FontAwesomeIcon
            icon={['fas', 'arrow-left']}
            transform={'shrink-5'}
          />
        </div>

        <div className={styles.arrows} onClick={iterate.bind(null, 1)}>
          <FontAwesomeIcon
            icon={['fas', 'arrow-right']}
            transform={'shrink-5'}
          />
        </div>
      </div>
    </div>
  );
}

function GameTags({ moves, myColor, isPeerConnected, history, timer }) {
  const connectionColor = isPeerConnected ? '#15c63c' : 'Tomato';
  const opponentColor = getOpponentColor(myColor);

  return (
    <div className={styles.controlBarInfoTags}>
      <div className={styles.controlTagContainer}>
        <span className={styles.controlTagHeader}>You</span>
        <span className={`fa-layers fa-fw ${styles.userIcon}`}>
          <PlayerColorCircle playerColor={myColor} />
        </span>
      </div>
      <div className={styles.controlTagContainer}>
        <span className={styles.controlTagHeader}>Opponent</span>
        <span className={`fa-layers fa-fw ${styles.userIcon}`}>
          <PlayerColorCircle playerColor={opponentColor} />
          <FontAwesomeIcon
            icon={['fas', 'circle']}
            transform={'shrink-5 right-9 up-9'}
            style={{ color: connectionColor }}
          />
        </span>
      </div>
      <div className={styles.controlTagContainer}>
        <span className={styles.controlTagHeader}>Moves</span>
        <h1 className={styles.controlTagValue}>
          {history.isIterating ? history.moves : moves}
        </h1>
      </div>
      <div className={styles.controlTagContainer}>
        <span className={styles.controlTagHeader}>Time</span>
        <div className={styles.controlTagValue}>
          <Timer initTime={timer} />
        </div>
      </div>
      <div className={styles.PlayersBox} />
    </div>
  );
}

const getOpponentColor = (myColor) => {
  return myColor === 'white' ? 'black' : 'white';
};

function PlayerColorCircle({ playerColor }) {
  const faStyle = playerColor === 'white' ? 'far' : 'fas';

  return (
    <FontAwesomeIcon
      icon={[faStyle, 'circle']}
      size={'2x'}
      transform={'shrink-5'}
    />
  );
}

function DeadPool({ className, whites, blacks }) {
  return (
    <Well className={className}>
      {/* <Row className={styles.killedPiecesLine}>
        <Col>
          {whites.map((piece) => {
            return (
              <Piece
                elements={{ role: piece.role, color: piece.color }}
                className={styles.killedPiece}
              />
            );
          })}
        </Col>
      </Row>
      <Row className={styles.killedPiecesLine}>
        <Col>
          {blacks.map((piece) => {
            return (
              <Piece
                elements={{ role: piece.role, color: piece.color }}
                className={styles.killedPiece}
              />
            );
          })}
        </Col>
      </Row> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Game);
