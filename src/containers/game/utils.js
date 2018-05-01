
export const getActionFlags = (selectedPiece, myColor, mySelections) => {
  const { 
    isEmptySquareSelected, 
    isMyPieceSelected, 
    previousSelectionCount, 
    isEnemyPieceSelected 
  } = getPieceSelectionsFlags(selectedPiece, myColor, mySelections);

  const isRedundantAction = (isEmptySquareSelected || !isMyPieceSelected) && previousSelectionCount === 0,
        shouldUpdateOwnPieceSelection = isMyPieceSelected && previousSelectionCount < 2,
        shouldMoveToEmptySquare = isEmptySquareSelected && previousSelectionCount === 1,
        shouldMoveToEnemySquare = isEnemyPieceSelected && previousSelectionCount === 1

  return { isRedundantAction, shouldUpdateOwnPieceSelection, shouldMoveToEmptySquare, shouldMoveToEnemySquare }

}

const getPieceSelectionsFlags = (selectedPiece, myColor, mySelections) => {
  const isMyPieceSelected = selectedPiece && selectedPiece.color === myColor,
        isEnemyPieceSelected = !isMyPieceSelected,
        previousSelectionCount = mySelections.count,
        isEmptySquareSelected = !selectedPiece

  return { isEmptySquareSelected, isMyPieceSelected, previousSelectionCount, isEnemyPieceSelected };
}
