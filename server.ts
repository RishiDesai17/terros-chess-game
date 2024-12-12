import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';

import { connectDB } from './db';
import Game from "./models/game";
import { isValidMove } from "./utils/moveValidate";
import { updateBoard, isGameOver } from "./utils";

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server);

connectDB(process.env.MONGO_URL);

interface GameCache {
  [socketId: string]: string;
}

let socketToGameRoomMapperCache: GameCache = {};

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
      socketToGameRoomMapperCache[socket.id] = gameId;
      socket.join(gameId);
      socket.emit('game-started', game);
      io.to(gameId).emit('game-update', game);
    }
    // if one player has joined
    else if (game?.players && !game.players.black) {
      game.players.black = socket.id;
      game.status = 'in-progress';
      await game.save();
      socketToGameRoomMapperCache[socket.id] = gameId;
      socket.join(gameId);
      socket.emit('game-started', game);
      io.to(gameId).emit('game-update', game);
    }
    // if both players are assigned
    else if (game?.players && game.players.white && game.players.black) {
      socket.emit('game-not-available', 'Game already has two players');
    }
    // If  game doesn't exist
    else {
      socket.emit('game-not-available', 'Game not available for joining');
    }
  });

  socket.on('make-move', async (gameId, from, to) => {
    const game = await Game.findOne({ gameId });
  
    if (!game || game.status !== 'in-progress') {
      socket.emit('game-not-in-progress', 'The game is not in progress');
      return;
    }
  
    if (game.turn !== (socket.id === game?.players?.white ? 'white' : 'black')) {
      socket.emit('not-your-turn', 'It\'s not your turn');
      return;
    }
  
    if (!isValidMove(game.board as unknown as Array<Array<string | null>>, from, to, game.turn)) {
      socket.emit('invalid-move', 'The move is invalid');
      return;
    }
  
    // @ts-ignore
    game.board = updateBoard(game.board as unknown as Array<Array<string | null>>, from, to);
  
    // Check if game over
    let gameStatus = '';
    
    if (isGameOver(game.board as unknown as Array<Array<string | null>>, game.turn)) {
      game.status = 'ended';
      game.winner = game.turn;
      gameStatus = 'game-ended';
    } else {
      game.turn = game.turn === 'white' ? 'black' : 'white';
      gameStatus = 'game-update';
    }
  
    await game.save();

    const moveData = { from, to, turn: game.turn, status: gameStatus, winner: game.winner || null };
  
    io.to(gameId).emit('game-update', moveData);
  
    if (socket.id === game?.players?.white || socket.id === game?.players?.black) {
      socket.emit('full-game-state', { board: game.board, turn: game.turn });
    }
  });

  socket.on('disconnect', async () => {
    const gameId = socketToGameRoomMapperCache[socket.id];
    if (gameId) {
      const game = await Game.findOne({ gameId });

      if (game) {
        // Pause the game if a player disconnects
        game.status = 'paused';
        await game.save();
        io.to(game.gameId).emit('game-paused', game);
      }

      delete socketToGameRoomMapperCache[socket.id];
      socket.leave(gameId);
    }
    console.log('A user disconnected');
  });

})

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
