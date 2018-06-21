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
  );
}

const SquareWrap = props => {
  const selectedClass = props.highlight.isSelected && styles.selectedHighlight;
  const optionClass = props.highlight.isOption && styles.optionHighlight
  return (
    <div 
      id={`${props.location.col}${props.location.row}`}
      className={`${styles[props.color]} ${selectedClass} ${optionClass}`}
      onClick={props.onClick.bind(null, {
        row: props.location.row, 
        col: props.location.col, 
        elements: props.elements
      })}   
    >
      {props.children}
    </div>
  );
}
