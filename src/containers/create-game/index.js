import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faClone from '@fortawesome/fontawesome-free-solid/faClone';
import * as actions from '../../actions/createGame';
import styles from './CreateGame.scss';
import { Button, OverlayTrigger, Tooltip, InputGroup, FormControl } from 'react-bootstrap';

class CreateGame extends React.Component {
  constructor(props) {
    super(props);
    this.gameIdRef = React.createRef();
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.isPeerConnected) {
      this.props.history.push('/game');
    }
  };
  createGame = () => {
    this.props.actions.createGame('white');
  };

  handleGameIdCopy = () => {
    this.gameIdRef.select();
    document.execCommand('copy');
    this.gameIdRef.blur();
  };

  currentElement = () => {
    if (this.props.isFetching) {
      return <Fetching />;
    }

    if (this.props.error) {
      return <Error />;
    }

    if (this.props.isGameCreated) {
      return (
        <CreateSuccess
          handleGameIdCopy={this.handleGameIdCopy}
          gameIdRef={(el) => (this.gameIdRef = el)}
          gameId={this.props.gameId}
          recreate={this.createGame}
        />
      );
    }

    return (
      <GameCreationMenu onCreate={this.createGame} onReturn={this.returnHome} />
    );
  };

  render() {
    return <div className={styles.centered}>{this.currentElement()}</div>;
  }
}

const Fetching = () => {
  return <FontAwesomeIcon icon={['fas', 'asterisk']} size={'3x'} spin />;
};

const CreateSuccess = ({ handleGameIdCopy, gameIdRef, gameId, recreate }) => {
  return (
    <React.Fragment>
      <h3>Game created successfully!</h3>
      <span>
        Share the identifier below with your peer. Waiting for connection..
      </span>
      <InputGroup className={styles.inputGroup}>
        <InputGroup.Button>
            <OverlayTrigger
              overlay={<Tooltip id={'create-copytocb'}>Copy to clipboard</Tooltip>}
              placement="top"
              delayShow={300}
              delayHide={150}
            >
              <Button
                onClick={handleGameIdCopy}
                style={{
                  boxShadow: 'none',
                }}
              >
                <FontAwesomeIcon icon={faClone} />
              </Button>
            </OverlayTrigger>{' '}
        </InputGroup.Button>
        <FormControl
          // readOnly
          style={{
            textAlign: 'center',
            boxShadow: 'none',
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          inputRef={gameIdRef}
          type="text"
          value={gameId}
        />
      </InputGroup>
    </React.Fragment>
  );
};

const GameCreationMenu = (props) => {
  return (
    <React.Fragment>
      <h1>Ready to play?</h1>
      <h2>In order to create a new game, press the button below</h2>
      <Button
        bsStyle={'warning'}
        className={styles.button}
        onClick={props.onCreate}
      >
        Create now
      </Button>
    </React.Fragment>
  );
};

const Error = () => {
  return <h1>Error..</h1>;
};

function mapStateToProps(state) {
  return {
    gameId: state.room.gameId,
    isFetching: state.createGame.isFetching,
    isGameCreated: state.createGame.isGameCreated,
    isPeerConnected: state.createGame.isPeerConnected,
    error: state.createGame.error,
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
)(CreateGame);
