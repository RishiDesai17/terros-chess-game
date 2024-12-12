import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';

import { connectDB } from './db';
import Game from "./models/game";

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server);

connectDB(process.env.MONGO_URL);


io.on("connection", (socket) => {
  socket.on('start-game', async () => {
    const newGame = new Game({
      gameId: `game-${Date.now()}`,
      board: Array(8).fill(Array(8).fill('empty')),
      turn: 'white',
      players: { white: socket.id },
      status: 'in-progress'
    });

    await newGame.save();
    socket.join(newGame.gameId);
  });

  socket.on('join-game', async (gameId) => {
    const game = await Game.findOne({ gameId });

    // If the game exists and no players assigned yet
    if (game?.players && !game.players.white) {
      // If the game has no white player...assign this socket as the white player
      game.players.white = socket.id;
      game.status = 'in-progress';
      await game.save();
      socket.join(gameId);  // Join the game room as the white player
      socket.emit('game-started', game);
      io.to(gameId).emit('game-update', game);
    }

    // If the game exists and the white player is already assigned, try assiging the black player
    else if (game?.players && !game.players.black) {
      game.players.black = socket.id;
      game.status = 'in-progress';
      await game.save();
      socket.join(gameId);  // Join the game room as the black player
      socket.emit('game-started', game);
      io.to(gameId).emit('game-update', game);
    }
    // If the game exists and both players are assigned
    else if (game?.players && game.players.white && game.players.black) {
      socket.emit('game-not-available', 'Game already has two players');
    }
    // If the game doesn't exist
    else {
      socket.emit('game-not-available', 'Game not available for joining');
    }
  });


})

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
