const crypto = require('crypto');

class ZobristHashing {
  constructor() {
    this.zobristTable = this.initializeZobrist();
  }

  initializeZobrist() {
    const table = [];
    const pieces = ['p', 'n', 'b', 'r', 'q', 'k', 'P', 'N', 'B', 'R', 'Q', 'K'];
    for (let i = 0; i < 64; i++) {
      table[i] = {};
      for (let piece of pieces) {
        table[i][piece] = BigInt('0x' + crypto.randomBytes(8).toString('hex'));
      }
    }
    return table;
  }

  // Convert FEN to a board representation (2D array)
  getBoardFromFEN(fen) {
    const board = [];
    const fenBoard = fen.split(' ')[0];  // Extract the board portion of the FEN string
    const rows = fenBoard.split('/');

    rows.forEach(row => {
      const boardRow = [];
      for (let char of row) {
        if (!isNaN(char)) {
          for (let i = 0; i < parseInt(char); i++) {
            boardRow.push(null);  // Empty squares
          }
        } else {
          boardRow.push({ type: char });
        }
      }
      board.push(boardRow);
    });

    return board.flat();  // Flatten the 2D array for easier processing
  }

  computeHash(fen) {
    let hash = BigInt(0);
    const board = this.getBoardFromFEN(fen);  // Get board from FEN
    board.forEach((piece, index) => {
      if (piece) {
        hash ^= this.zobristTable[index][piece.type];  // Ensure all calculations use BigInt
      }
    });
    return hash;
  }
}

module.exports = ZobristHashing;
