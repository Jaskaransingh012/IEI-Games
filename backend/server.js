import {Server} from 'socket.io'
import express from 'express';
import http from 'http';
import cors from 'cors';
import quizSocket from './sockets/QuizServer.js';

const app = express();

app.use(cors());
app.use(express.json());
const server = http.createServer(app);



const io = new Server(server,{
cors:{
    origin: '*',
},
})

const rooms = new Map();

quizSocket(io,rooms);



server.listen(8080, () => console.log('✅ Socket.io server on http://localhost:8080'));

