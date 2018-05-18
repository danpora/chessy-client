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
        <NavLink exact to="/" >
          <div>About</div>
        </NavLink>
        {' | '}
        <NavLink exact to="/" >
          <div>Donate</div>
        </NavLink>
      </div>
    </div>
  );
}
