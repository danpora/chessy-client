import React from 'react';
import { Link } from 'react-router-dom';

import styles from './NotFound.scss';

const NotFoundPage = () => {
  return (
    <div className={styles.wrapper}>
      <h2>
        404 Page Not Found
      </h2>
      <i className="fas fa-exclamation fa-5x"></i>
    </div>
  );
};

export default NotFoundPage;
