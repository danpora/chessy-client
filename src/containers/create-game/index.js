import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/createGame';
import styles from './styles.scss';
import * as Service from '../../service/socket';
import { WaitForPeer } from '../../components/create-game/WaitForPeer';
import { Button } from 'react-bootstrap';

class CreateGame extends React.Component {
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.isPeerConnected) {
      this.props.history.push('/game')      
    }
  }
  createGame = () => {
    this.props.actions.createGame('white');
  };

  render() {
    if (this.props.isFetching) {
      return <Fetching />;
    }

    if (this.props.error) {
      return <Error />;
    }

    if (this.props.isGameCreated) {
      return <CreateSuccess gameId={this.props.gameId} recreate={this.createGame}/>;
    }

    return (
      <GameCreationMenu onCreate={this.createGame} onReturn={this.returnHome} />
    );
  }
}

const Fetching = () => {
  return <h3>Loading..</h3>;
};

const CreateSuccess = ({ gameId, recreate }) => {
  return (
    <div>
      <h3>game created successfully</h3>
      <h3>gameId:{gameId}</h3>
      <h3>recreate game</h3>
      <Button onClick={recreate}>Recreate game</Button>
    </div>
  );
};
const GameCreationMenu = (props) => {
  return (
    <div className={styles.centered}>
      <h1>Ready to play?</h1>
      <h2>To create a new game, press the 'Generate game' button</h2>
      <Button bsStyle={'warning'} className={styles.button} onClick={props.onCreate}>Generate</Button>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateGame);
