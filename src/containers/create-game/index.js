import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/createGame';
import styles from './styles.scss';
import * as Service from '../../service/socket';
import { WaitForPeer } from '../../components/create-game/WaitForPeer';
import { Button, Well, Alert, Panel } from 'react-bootstrap';

class CreateGame extends React.Component {
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.isPeerConnected) {
      this.props.history.push('/game');
    }
  };
  createGame = () => {
    this.props.actions.createGame('white');
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
        <CreateSuccess gameId={this.props.gameId} recreate={this.createGame} />
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
  return <h3>Loading..</h3>;
};

const CreateSuccess = ({ gameId, recreate }) => {
  return (
    <React.Fragment>
      <h3>Game created successfully!</h3>
      <Alert>
        Share the identifier below with your peer, and wait for him to connect
      </Alert>
      <Panel bsStyle={'success'}>
        <Panel.Heading>Game identifier</Panel.Heading>
        <Panel.Body>{gameId}</Panel.Body>
      </Panel>
      <Button className={styles.button} onClick={recreate}>
        Recreate
      </Button>
    </React.Fragment>
  );
};
const GameCreationMenu = (props) => {
  return (
    <React.Fragment>
      <h1>Ready to play?</h1>
      <h2>To create a new game, press the 'Generate game' button</h2>
      <Button
        bsStyle={'warning'}
        className={styles.button}
        onClick={props.onCreate}
      >
        Generate
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
