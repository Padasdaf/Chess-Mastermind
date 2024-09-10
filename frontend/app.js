const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status-text');
const newGameButton = document.getElementById('new-game');

let board = null;
let game = new Chess();

// Initialize Chessboard
function initializeBoard() {
  board = Chessboard('board', {
    position: 'start',
    pieceTheme: 'chessboard/img/chesspieces/wikipedia/{piece}.png',
    draggable: true,
    onDrop: handleMove
  });
  game.reset();
}

// Handle Player Move
function handleMove(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q'  // Always promote to a queen
  });

  if (move === null) return 'snapback';  // Illegal move

  // Send the move to the backend AI
  fetch('/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fen: game.fen() })  // Send the board state (FEN)
  })
  .then(response => response.json())
  .then(data => {
    console.log("AI's best move:", data.bestMove);
    if (data.bestMove) {
      game.move(data.bestMove);  // Apply the AI's best move
      updateBoard();  // Update the board visually
    }
    updateStatus();  // Update game status (e.g., check, checkmate)
  })
  .catch(error => console.error("Error during AI move fetch:", error));
}

// Update the Chessboard UI
function updateBoard() {
  board.position(game.fen());
}

// Update Game Status
function updateStatus() {
  let status = '';

  if (game.in_checkmate()) {
    status = 'Checkmate! ' + (game.turn() === 'w' ? 'Black' : 'White') + ' wins.';
  } else if (game.in_draw()) {
    status = 'Draw!';
  } else {
    status = (game.turn() === 'w' ? 'White' : 'Black') + ' to move.';
    if (game.in_check()) {
      status += ' Check!';
    }
  }

  statusElement.textContent = status;
}

// New Game Button Handler
newGameButton.addEventListener('click', () => {
  initializeBoard();
  updateStatus();
});

// Initialize the game on page load
window.onload = () => {
  initializeBoard();
  updateStatus();
};
