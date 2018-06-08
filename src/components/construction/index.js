import React from 'react';
import styles from './Construction.scss';

const Construction = (props) => {
  return (
    <div className={styles.wrapper}>
      <i className="fas fa-wrench"></i>
      <span>{`${props.title || 'This page'} is under construction!`}</span>
    </div>
  );
}

export default Construction;