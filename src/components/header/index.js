import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import styles from './header.scss';

export function Header(props) {
  return (
    <div className={props.className}>
      <div className={styles.wrapper}>
        <div>
          <FontAwesomeIcon icon={['fas', 'chess-queen']} size={'5x'} />
        </div>
        <div className={styles.appName}>
          <span>Chessy</span>
        </div>
      </div>
    </div>
  );
}
