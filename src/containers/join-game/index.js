import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, FormGroup, FormControl, Form } from 'react-bootstrap';
import * as actions from '../../actions/joinGame';
import styles from './JoinGame.scss';

class JoinGame extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.shouldRedirectToGame) {
      this.props.history.push('/game');
    }
  };

  updateGameId = (e) => {
    const gameId = e.target.value;
    this.props.actions.updateGameId(gameId);
  };

  onJoin = () => {
    const { gameId } = this.props;
    this.props.actions.joinGame(gameId);
  };

  render() {
    return (
      <div className={styles.centered}>
        <h2 align="center">
          To join the game,<br />please enter game ID
        </h2>
        <Form className={styles.formGroup} horizontal>
          <FormGroup bsSize="large">
            <FormControl
              type="text"
              placeholder="Enter Game ID"
              onChange={this.updateGameId}
            />
          </FormGroup>
        </Form>
        <Button className={styles.button} bsStyle={'warning'} onClick={this.onJoin}>
          Join
        </Button>
      </div>
    );
  }
}

JoinGame.propTypes = {
  gameId: PropTypes.any.isRequired,
  shouldRedirectToGame: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    gameId: state.joinGame.gameId,
    shouldRedirectToGame: state.joinGame.shouldRedirectToGame,
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
)(JoinGame);
