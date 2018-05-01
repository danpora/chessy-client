import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Grid, Row, Col, Well } from 'react-bootstrap';
import * as actions from '../../actions/createGame';
import styles from './create-game.scss';
import featureStyle from '../../styles/feature.scss'
import * as Service from '../../service/socket'
import classnames from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

class CreateGame extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.peerConnected) {
      this.props.history.push('/game')
    }
  }

  onCreateGameClick = () => {
    this.props.actions.createGame('white')
  }

  render() {
    const containerClasses = classnames(featureStyle.container, featureStyle.centerHorizontaly)
    return (
      <div className={containerClasses}>
        {
          this.props.isWaitingForPeer
            ? <WaitingForPeerView gameId={this.props.gameId} />
            : <InitialCreateGameView
              onCreateGameClick={this.onCreateGameClick}
              loading={this.props.loading}
              isWaitingForPeer={this.props.isWaitingForPeer}
            />
        }
      </div>
    );
  }
}

CreateGame.propTypes = {
  gameId: PropTypes.any.isRequired,
  peerConnected: PropTypes.bool.isRequired
};

function InitialCreateGameView({ onCreateGameClick, loading, isWaitingForPeer }) {
  const contentHeaderClasses = classnames(styles.marginBottom, styles.centerHorizontaly, featureStyle.title)
  return (
    <div className={styles.contentContainer}>
      <Row className={contentHeaderClasses}>
        <span>Press to create a room</span>
      </Row>
      <Row className={styles.centerHorizontaly}>
        <Button
          className={featureStyle.generateButton}
          bsStyle={'warning'}
          onClick={onCreateGameClick}
          disabled={loading || isWaitingForPeer}
        >
          {loading ? 'Loading..' : 'Generate'}
        </Button>
      </Row>
    </div>
  )
}

function WaitingForPeerView({ gameId }) {
  const wellRowClasses = classnames(featureStyle.flexJustifyCenter, styles.gameIdWell)
  const waitingForPeerRowClasses = classnames(featureStyle.flexJustifyCenter, featureStyle.flexDirectionColumn)
  const centerAndRowClasses = classnames(featureStyle.flexJustifyCenter, featureStyle.flexDirectionRow)
  const mainHeader = classnames(centerAndRowClasses, styles.marginBottomDouble)
  const middleHeader = classnames(centerAndRowClasses, styles.marginBottomMedium)
  const mediumTitleHighBottomMargin = classnames(featureStyle.mediumTitle, styles.bottomMarginExtra)

  return (
    <div className={featureStyle.flexDirectionColumn}>
      <div className={mainHeader}>
        <FontAwesomeIcon icon={["far", "check-square"]} size={'3x'} className={featureStyle.iconNotificationLine} />
        <span className={featureStyle.mediumTitle}>Room created successfully</span>
      </div>
      <div className={middleHeader}>
        <FontAwesomeIcon icon={["fas", "key"]} size={'3x'} className={featureStyle.iconNotificationLine} />
        <span className={featureStyle.mediumTitle}>Game ID</span>
      </div>
      <Well className={styles.gameIdWell}>
        <span className={styles.textAlignCenter}>{gameId}</span>
      </Well>
      <div className={featureStyle.flexJustifyCenter}>
        <div className={featureStyle.flexDirectionColumn}>
          <span className={mediumTitleHighBottomMargin}>Waiting for peer to connect..</span>
          <FontAwesomeIcon icon={["fas", "stopwatch"]} size={'5x'} className={styles.waitingElement} spin/>
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    gameId: state.room.gameId,
    loading: state.createGame.loading,
    peerConnected: state.createGame.peerConnected,
    isWaitingForPeer: state.createGame.isWaitingForPeer
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
)(CreateGame);