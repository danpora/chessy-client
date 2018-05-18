import React from 'react';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/createGame';
import { Button, Row, Col } from 'react-bootstrap';

import styles from './homepage.scss';

export default class HomePage extends React.Component {
  render() {
    return <HomeNav className={styles.homeNav} />;
  }
};

const HomeNav = ({ className }) => {
  return (
    <div className={className}>
      <NavButton
        title={'Create game'}
        route={'create'}
        className={styles.button}
      />
      <NavButton title={'Join game'} route={'join'} className={styles.button} />
      <NavButton
        title={'Player with computer'}
        route={'machine'}
        className={styles.button}
      />
    </div>
  );
};

const NavButton = ({ className, title, route }) => {
  return (
    <NavLink
      to={route}
      style={{ textDecoration: 'none' }}
      className={className}
    >
      <span>{title}</span>
    </NavLink>
  );
};
