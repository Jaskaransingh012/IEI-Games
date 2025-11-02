import {Server} from 'socket.io'
import express from 'express';
import http from 'http';
import cors from 'cors';
import adminSockets from './sockets/admin.socket';

const io = new Server(server,{
cors:{
    origin: '*',
},
})


io.on('connection', (socket) => {
  adminSockets(io, socket);
});


const app = express();

const server = http.createServer(app);

