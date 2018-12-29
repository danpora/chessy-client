import React from 'react';
import styles from './piece.scss'

export const Piece = (props) => {
  const { elements, className } = props

  return (
    elements
      ? <img 
          className={className || styles.img}
          src={require(`../../assets/images/pieces/${elements.color}_${elements.role}.png`)}
        />
      : null
  )
}

export const getPieceState = (role, color) => ({
  role,
  color
})