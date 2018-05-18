import React, { Component } from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import { Switch, NavLink, Route } from 'react-router-dom';
import HomePage from './containers/homepage';
import CreateGame from './containers/create-game';
import Game from './containers/game';
import AboutPage from './components/about';
import NotFoundPage from './components/not-found';
import JoinGame from './containers/join-game';

import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';
import solids from '@fortawesome/fontawesome-free-solid';

import { Footer } from './components/footer'
import { Header } from './components/header'

fontawesome.library.add(brands, solids);

import styles from './App.scss';

class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        <Header className={styles.header}/>
        <Content className={styles.content} />
        <Footer className={styles.footer} />
      </div>
    );
  }
}

function Content(props) {
  return (
    <div className={props.className}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/create" component={CreateGame} />
        <Route exact path="/join" component={JoinGame} />
        <Route exact path="/game" component={Game} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}

export default App;
