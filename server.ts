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
    
})

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
