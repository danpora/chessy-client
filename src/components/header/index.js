import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import styles from './header.scss';

export function Header(props) {
  return (
    <div className={props.className}>
      <NavLink to="/" className={styles.wrapper}>
        <div>
          <FontAwesomeIcon icon={['fas', 'chess-queen']} size={'5x'} />
        </div>
        <div className={styles.appName}>
          <span>Chessy</span>
        </div>
      </NavLink>
    </div>
  );
}
