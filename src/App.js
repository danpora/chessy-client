import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from './containers/homepage';
import CreateGame from './containers/create-game';
import Game from './containers/game';
import About from './components/about';
import Machine from './components/machine';
import NotFoundPage from './components/not-found';
import JoinGame from './containers/join-game';

import fontawesome from '@fortawesome/fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';
import solids from '@fortawesome/fontawesome-free-solid';

import { Footer } from './components/footer'
import { Header } from './components/header'

fontawesome.library.add(brands, solids);

import '../favicon.ico';

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
        <Route exact path="/machine" component={Machine} />
        <Route exact path="/about" component={About} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}

export default App;
