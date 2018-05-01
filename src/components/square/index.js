import React from 'react';
import { Piece } from '../piece'
import styles from './square.css'

export const Square = props => {
  const { elements } = props

  return (
    <SquareWrap {...props}>
      <Piece 
        elements={elements}
      />
    </SquareWrap>
  )
}

const SquareWrap = props => {
  const highlightClass = props.highlight && styles.highlight
  
  return (
    <div 
      id={`${props.location.col}${props.location.row}`}
      className={`${styles.square} ${styles[props.color]} ${highlightClass}`}
      onClick={props.onClick.bind(null, {
        row: props.location.row, 
        col: props.location.col, 
        elements: props.elements
      })}   
    >
      {props.children}
    </div>
  )
}
