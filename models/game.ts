import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  board: { type: [[String]], required: true },
  turn: { type: String, enum: ["white", "black"], required: true },
  players: {
    white: { type: String, required: false },
    black: { type: String, required: false }
  },
  status: { type: String, enum: ["waiting", "in-progress", "paused", "ended"], default: "waiting" },
  winner: { type: String, required: false }
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
