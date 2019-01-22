import React from 'react';
import { NavLink } from 'react-router-dom';

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
        title={'Play with computer'}
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
