import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap'
import styles from './homepage.scss'

const HomePage = () => {
  return (
    <div className={styles.pageContainer}>
      <HomeNav />
    </div>
  );
};

const HomeNav = () => {
  return (
    <div className={styles.homeNav}>
      <div className={styles.homeNavButtons}>
        <Row className={styles.navMainRow}>
          <NavLink to="/create" className={styles.navMainElement} style={{ textDecoration: "none" }}>
            <span className={styles.navTitle}>
              Create game
            </span>
          </NavLink>
        </Row>

        <Row className={styles.navMainRow}>
          <NavLink to="/join" className={styles.navMainElement} style={{ textDecoration: "none" }}>
            <span className={styles.navTitle}>
              Join game
          </span>
          </NavLink>
        </Row>

        <Row className={styles.navMainRow}>
          <NavLink to="/machine" className={styles.navMainElement} style={{ textDecoration: "none" }}>
            <span className={styles.navTitle}>
              Play with machine
            </span>
          </NavLink>
        </Row>
      </div>
    </div>
  )
}

export default HomePage;
