import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
  origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Access-Control-Allow-Origin']
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  path: '/socket.io/',
  allowEIO3: true
});

// Store connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  console.log('Auth data:', socket.handshake.auth);

  // Handle user joining
  socket.on('user:join', (userId: string) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Handle flashcard updates
  socket.on('flashcard:update', (data) => {
    console.log('Received flashcard update:', data);
    const { userId, flashcard } = data;
    
    // Emit to all clients except sender
    socket.broadcast.emit('flashcard:updated', {
      userId,
      flashcard
    });
    console.log('Broadcasted flashcard update to other clients');
  });

  socket.on('flashcard:delete', (data) => {
    console.log('Received flashcard delete:', data);
    const { userId, flashcardId } = data;
    socket.broadcast.emit('flashcard:deleted', {
      userId,
      flashcardId
    });
  });

  socket.on('flashcard:lock', (data) => {
    console.log('Received flashcard lock:', data);
    const { userId, flashcardId } = data;
    socket.broadcast.emit('flashcard:locked', {
      userId,
      flashcardId
    });
  });

  socket.on('flashcard:unlock', (data) => {
    console.log('Received flashcard unlock:', data);
    const { userId, flashcardId } = data;
    socket.broadcast.emit('flashcard:unlocked', {
      userId,
      flashcardId
    });
  });

  socket.on('flashcard:create', (data) => {
    console.log('Received flashcard create:', data);
    const { userId, flashcard } = data;
    socket.broadcast.emit('flashcard:created', {
      userId,
      flashcard
    });
  });

  // Handle test progress updates
  socket.on('test:progress', (data) => {
    const { userId, progress } = data;
    socket.broadcast.emit('test:progress:updated', {
      userId,
      progress
    });
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
    // Remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

const PORT = process.env.SOCKET_PORT || 3002;

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log('CORS enabled for:', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
}); 