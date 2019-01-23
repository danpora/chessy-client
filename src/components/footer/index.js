import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './footer.scss'

export function Footer(props) {
  return (
    <div className={props.className}>
      <div className={styles.wrapper}>
        <NavLink exact to="/" >
          <div>Home</div>
        </NavLink>
        {' | '}
        <NavLink exact to="/about" >
          <div>About</div>
        </NavLink>
        {' | '}
        <a href="https://github.com/danpora/chessy-client" >
          <div>GitHub</div>
        </a>
      </div>
    </div>
  );
}
