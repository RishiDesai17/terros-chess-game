import { convertToCoordinates } from './index';

// Helper function to check if a move is valid for the pawn
function isValidPawnMove(board: (string | null)[][], from: string, to: string, turn: string): boolean {
  const [fromRow, fromCol] = convertToCoordinates(from);
  const [toRow, toCol] = convertToCoordinates(to);
  const piece = board[fromRow][fromCol];
  const targetPiece = board[toRow][toCol];

  // pawn move up (whit)
  if (turn === 'white' && piece?.startsWith('w')) {
    if (fromCol === toCol && targetPiece === null) {
      // 1 step forward (white)
      if (fromRow - 1 === toRow) {
        return true;
      }
      // 2 step forward (white)
      if (fromRow === 6 && fromRow - 2 === toRow) {
        return true;
      }
    }
    // white diagonal attack
    if (Math.abs(fromCol - toCol) === 1 && fromRow - 1 === toRow && targetPiece && targetPiece.startsWith('b')) {
      return true;
    }
  }

  // Black pawn moves down
  if (turn === 'black' && piece?.startsWith('b')) {
    if (fromCol === toCol && targetPiece === null) {
      // Black pawn can move one step forward
      if (fromRow + 1 === toRow) {
        return true;
      }
      // Black pawn can move two steps forward if it is on the second rank
      if (fromRow === 1 && fromRow + 2 === toRow) {
        return true;
      }
    }
    // Black pawn captures diagonally
    if (Math.abs(fromCol - toCol) === 1 && fromRow + 1 === toRow && targetPiece && targetPiece.startsWith('w')) {
      return true; // Capture opponent piece
    }
  }

  return false;
}

function isValidKnightMove(from: string, to: string): boolean {
    const [fromRow, fromCol] = convertToCoordinates(from);
    const [toRow, toCol] = convertToCoordinates(to);
  
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
  
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

function isValidRookMove(board: (string | null)[][], from: string, to: string): boolean {
  // implement later if there is time
  return false;
}

function isValidBishopMove(board: (string | null)[][], from: string, to: string): boolean {
  // implement later if there is time
  return false;
}

function isValidQueenMove(board: (string | null)[][], from: string, to: string): boolean {
  return isValidRookMove(board, from, to) || isValidBishopMove(board, from, to);
}

function isValidKingMove(from: string, to: string): boolean {
  const [fromRow, fromCol] = convertToCoordinates(from);
  const [toRow, toCol] = convertToCoordinates(to);

  return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
}

export function isValidMove(board: (string | null)[][], from: string, to: string, turn: string): boolean {
  const [fromRow, fromCol] = convertToCoordinates(from);
  const [toRow, toCol] = convertToCoordinates(to);

  const piece = board[fromRow][fromCol];
  const targetPiece = board[toRow][toCol];

  // Same color validation
  if ((turn === 'white' && piece?.startsWith('w') && targetPiece?.startsWith('w')) || (turn === 'black' && piece?.startsWith('b') && targetPiece?.startsWith('b'))) {
    return false;
  }

  switch (piece?.toLowerCase()) {
    case 'p': // Pawn
      return isValidPawnMove(board, from, to, turn);
    case 'r': // Rook
      return isValidRookMove(board, from, to);
    case 'n': // Knight
      return isValidKnightMove(from, to);
    case 'b': // Bishop
      return isValidBishopMove(board, from, to);
    case 'q': // Queen
      return isValidQueenMove(board, from, to);
    case 'k': // King
      return isValidKingMove(from, to);
    default:
      return false;
  }
}
