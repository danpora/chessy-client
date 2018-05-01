import React, { Component } from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import { Switch, NavLink, Route} from 'react-router-dom';
import HomePage from './components/homepage'
import CreateGame from './containers/create-game';
import Game from './containers/game';
import AboutPage from './components/about';
import NotFoundPage from './components/not-found';
import JoinGame from './containers/join-game';

import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';
import solids from '@fortawesome/fontawesome-free-solid';

fontawesome.library.add(brands, solids);

import styles from './App.scss';

// import './App.css';

class App extends Component {
  render() {
    const activeStyle = { color: 'blue' };
    return (
      <div className={styles.App}>
        <Row className={styles.topRow}>
          <Col className={styles.logoElement}>
            <FontAwesomeIcon icon={['fas', 'chess-queen']} size={'5x'} />
          </Col>
          <Col className={`${styles.logoElement} ${styles.chessyTitle}`}>
            <span>Chessy</span>
          </Col>
        </Row>
        <Row className={styles.featureContainer}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/create" component={CreateGame} />
            <Route path="/join" component={JoinGame} />
            <Route path="/game" component={Game} />
            <Route component={NotFoundPage} />          </Switch>
        </Row>
        <Row className={styles.bottomRow}>
          <div className={styles.bottomWrapper}>
            <NavLink exact to="/" className={styles.bottomRowElement}>
              <div>Home</div>
            </NavLink>
            {' | '}
            <NavLink exact to="/" className={styles.bottomRowElement}>
              <div>About</div>
            </NavLink>
            {' | '}
            <NavLink exact to="/" className={styles.bottomRowElement}>
              <div>Donate</div>
            </NavLink>
          </div>
        </Row>
      </div>
    );
  }
}

export default App;
