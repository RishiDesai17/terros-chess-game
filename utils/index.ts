export const initialBoard = [
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];

export const updateBoard = (board: Array<Array<string | null>>, from: string, to: string): Array<Array<string | null>> => {
    const fromCoord = convertToCoordinates(from);
    const toCoord = convertToCoordinates(to);

    board[toCoord[0]][toCoord[1]] = board[fromCoord[0]][fromCoord[1]];
    board[fromCoord[0]][fromCoord[1]] = null;

    return board;
};

// Convert chess board symbol ("e2") into 2d array indexes (0-7)
export function convertToCoordinates(square: string): [number, number] {
    const column = square.charCodeAt(0) - 97;
    const row = 8 - parseInt(square[1]);
    return [row, column];
}

export function isGameOver(board: string[][], turn: string): boolean {
    const kingPosition = findKing(board, turn);

    if (!kingPosition) {
        return false;  // King not found, something went wrong
    }

    if (isKingInCheck(board, kingPosition, turn)) {
        // Checkmate detection logic implement if time permits
        return true;
    }

    return false;
}

export function isKingInCheck(board: string[][], kingPosition: [number, number], turn: string): boolean {
    // Implement if time permits
    return false;
}

export function findKing(board: string[][], turn: string): [number, number] | null {
    const king = turn === 'white' ? 'wK' : 'bK';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === king) {
                return [row, col];
            }
        }
    }

    return null;  // King not found
}

