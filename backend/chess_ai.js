const Chess = require('chess.js').Chess;

class ChessAI {
  constructor() {
    this.game = new Chess();
  }

  evaluateBoard() {
    const pieceValues = {
      p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000,
      P: -100, N: -320, B: -330, R: -500, Q: -900, K: -20000
    };

    let evaluation = 0;
    const board = this.game.board();

    for (let row of board) {
      for (let piece of row) {
        if (piece) {
          evaluation += pieceValues[piece.type];
        }
      }
    }

    return evaluation;
  }

  minimax(depth, isMaximizingPlayer) {
    if (depth === 0 || this.game.game_over()) {
      return this.evaluateBoard();
    }

    const moves = this.game.moves({ verbose: true });
    let value;

    if (isMaximizingPlayer) {
      value = -Infinity;
      for (let move of moves) {
        this.game.move(move);
        value = Math.max(value, this.minimax(depth - 1, false));
        this.game.undo();
      }
    } else {
      value = Infinity;
      for (let move of moves) {
        this.game.move(move);
        value = Math.min(value, this.minimax(depth - 1, true));
        this.game.undo();
      }
    }

    return value;
  }

  getBestMove(depth = 3) {  // Reduced depth to prevent long calculations
    let bestMove = null;
    let bestValue = -Infinity;
    const moves = this.game.moves({ verbose: true });

    for (let move of moves) {
      this.game.move(move);
      const boardValue = -this.minimax(depth - 1, false);
      this.game.undo();
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    }

    console.log("Best move chosen by AI:", bestMove);
    return bestMove ? bestMove.san : null;
  }

  resetGame() {
    this.game.reset();
  }
}

module.exports = ChessAI;
