import React from 'react';
import { Piece } from '../piece'
import styles from './square.scss'

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
  console.log('props.color::', props.color)
  
  return (
    <div 
      id={`${props.location.col}${props.location.row}`}
      className={styles[props.color]}
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
