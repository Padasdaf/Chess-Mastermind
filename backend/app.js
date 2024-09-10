const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ChessAI = require('./chess_ai');

const app = express();
const port = process.env.PORT || 3000;

const ai = new ChessAI();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/move', (req, res) => {
  const { fen } = req.body;

  // Log FEN to verify if it's being received
  console.log("Received FEN:", fen);

  if (!fen) {
    console.error("FEN not provided");
    return res.status(400).json({ error: 'FEN not provided' });
  }

  // Load the FEN state into the chess game
  ai.game.load(fen);
  console.log("FEN loaded into the game");

  // Get the AI's best move
  const bestMove = ai.getBestMove(3);  // Reduced depth for speed
  console.log("Best move from AI:", bestMove);  // Log the best move

  if (bestMove) {
    // Respond with the AI move (in SAN format)
    return res.json({ bestMove });
  } else {
    return res.json({ bestMove: null });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Chess AI server running at http://localhost:${port}`);
});
