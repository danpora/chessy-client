import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, FormGroup, FormControl, Col, Form } from 'react-bootstrap';
import * as actions from '../../actions/joinGame';
import styles from './join-game.scss';
import featureStyle from '../../styles/feature.scss'
import * as Service from '../../service/socket'
import classnames from 'classnames'

class JoinGame extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.shouldRedirectToGame) {
      this.props.history.push('/game')
    }
  }

  updateGameId = e => {
    const gameId = e.target.value
    this.props.actions.updateGameId(gameId)
  }

  onJoin = () => {
    const { gameId, history } = this.props
    this.props.actions.joinGame(gameId)
  }

  render () {
    const titleClasses = classnames(styles.marginBottom, featureStyle.flexJustifyCenter, featureStyle.title)
    const featureClasses = classnames(styles.columnOrder, featureStyle.container)

    return (
      <div className={featureClasses}>
        <p align="center" className={titleClasses}>
          To join the game,<br/>please enter game ID
        </p>
        <Form horizontal>
          <FormGroup 
            bsSize="large"
            className={styles.marginBottom}
          >
            <FormControl 
              type="text" 
              placeholder="Enter Game ID"
              onChange={this.updateGameId}
            />
          </FormGroup>
          <Col className={styles.centerHorizontaly}>
            <Button 
              className={featureStyle.generateButton}
              bsStyle={'warning'}
              onClick={this.onJoin}
            > Join
            </Button>
          </Col>
        </Form>
      </div>
    );
  }
}

JoinGame.propTypes = {
  gameId: PropTypes.any.isRequired,
  shouldRedirectToGame: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    gameId: state.joinGame.gameId,
    shouldRedirectToGame: state.joinGame.shouldRedirectToGame
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinGame);