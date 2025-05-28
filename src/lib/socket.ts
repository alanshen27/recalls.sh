import { io, Socket } from 'socket.io-client';
import { Flashcard } from './types';

// Types
export type SocketEvent = 
  | 'flashcard:updated'
  | 'test:progress:updated';

export interface FlashcardUpdateData {
  userId: string;
  flashcardId: string;
  action: 'create' | 'update' | 'delete';
}

export interface TestProgressData {
  userId: string;
  progress: number;
}

// Socket instance
let socket: Socket | null = null;

// Socket state logging
const logSocketState = () => {
  if (!socket) return;
  console.log('[Client] Socket state:', {
    connected: socket.connected,
    id: socket.id,
    transport: socket.io.engine.transport.name,
    readyState: socket.io.engine.readyState
  });
};

// Initialize socket
export const initializeSocket = (userId: string) => {
  if (!socket) {
    console.log('[Client] Initializing socket connection @', process.env.NEXT_PUBLIC_SOCKET_URL);
    
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3003', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      path: '/socket.io/',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true,
      autoConnect: true,
      rejectUnauthorized: false,
      extraHeaders: {
        'Access-Control-Allow-Origin': '*'
      },
      timeout: 10000,
      autoUnref: false,
      randomizationFactor: 0.5
    });

    socket.on('connect', () => {
      console.log('[Client] Socket connected:', socket?.id);
      console.log('[Client] Socket transport:', socket?.io.engine.transport.name);
      logSocketState();
      socket?.emit('user:join', userId);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Client] Socket disconnected:', reason);
      logSocketState();
    });

    socket.on('connect_error', (error) => {
      console.error('[Client] Socket connection error:', error);
      logSocketState();
    });

    socket.on('error', (error) => {
      console.error('[Client] Socket error:', error);
      logSocketState();
    });

    // Set up event listeners
    socket.on('flashcard:updated', (data: FlashcardUpdateData) => {
      console.log('[Client] Received flashcard:updated event:', data);
      eventHandlers.get('flashcard:updated')?.forEach(handler => handler(data));
    });

    socket.on('test:progress:updated', (data: TestProgressData) => {
      console.log('[Client] Received test:progress:updated event:', data);
      eventHandlers.get('test:progress:updated')?.forEach(handler => handler(data));
    });
  }
  return socket;
};

// Event handlers
const eventHandlers = new Map<SocketEvent, Set<(data: unknown) => void>>();

// Get socket instance
export const getSocket = () => {
  if (!socket) {
    return initializeSocket('');
  }
  return socket;
};

// Event handling
export const on = (event: SocketEvent, handler: (data: unknown) => void) => {
  console.log('[Client] Registering handler for event:', event);
  if (!eventHandlers.has(event)) {
    eventHandlers.set(event, new Set());
  }
  eventHandlers.get(event)?.add(handler);
};

export const off = (event: SocketEvent, handler: (data: unknown) => void) => {
  eventHandlers.get(event)?.delete(handler);
};

// Event emitters
export const emitFlashcardUpdate = (flashcard: Flashcard, userId: string) => {
  const socket = getSocket();
  if (!socket?.connected) {
    console.error('[Client] Socket not connected, cannot emit event');
    // Try to reconnect
    socket?.connect();
    return;
  }

  console.log('[Client] Emitting flashcard:update event:', { flashcard, userId });
  socket.emit('flashcard:update', {
    userId,
    flashcard
  }, (response: { success: boolean, error?: string }) => {
    if (!response.success) {
      console.error('[Client] Failed to update flashcard:', response.error);
    }
  });
};

export const emitFlashcardDelete = (flashcardId: string, userId: string) => {
  const socket = getSocket();
  if (!socket?.connected) {
    console.error('[Client] Socket not connected, cannot emit event');
    // Try to reconnect
    socket?.connect();
    return;
  }
  console.log('[Client] Emitting flashcard:delete event:', { flashcardId, userId });
  socket.emit('flashcard:delete', {
    userId,
    flashcardId
  }, (response: { success: boolean, error?: string }) => {
    if (!response.success) {
      console.error('[Client] Failed to delete flashcard:', response.error);
    }
  });
};

export const emitFlashcardCreate = (flashcard: Flashcard, userId: string) => {
  const socket = getSocket();
  if (!socket?.connected) {
    console.error('[Client] Socket not connected, cannot emit event');
    // Try to reconnect
    socket?.connect();
    return;
  }
  console.log('[Client] Emitting flashcard:create event:', { flashcard, userId });
  socket.emit('flashcard:create', {
    userId,
    flashcard
  }, (response: { success: boolean, error?: string }) => {
    if (!response.success) {
      console.error('[Client] Failed to create flashcard:', response.error);
    }
  });
};

export const emitFlashcardLock = (flashcardId: string, userId: string) => {
  const socket = getSocket();
  if (!socket?.connected) {
    console.error('[Client] Socket not connected, cannot emit event');
    // Try to reconnect
    socket?.connect();
    return;
  }
  console.log('[Client] Emitting flashcard:lock event:', { flashcardId, userId });
  socket.emit('flashcard:lock', {
    userId,
    flashcardId
  }, (response: { success: boolean, error?: string }) => {
    if (!response.success) {
      console.error('[Client] Failed to lock flashcard:', response.error);
    }
  });
};

export const emitFlashcardUnlock = (flashcardId: string, userId: string) => {
  const socket = getSocket();
  if (!socket?.connected) {
    console.error('[Client] Socket not connected, cannot emit event');
    // Try to reconnect
    socket?.connect();
    return;
  }
  console.log('[Client] Emitting flashcard:unlock event:', { flashcardId, userId });
  socket.emit('flashcard:unlock', {
    userId,
    flashcardId
  }, (response: { success: boolean, error?: string }) => {
    if (!response.success) {
      console.error('[Client] Failed to unlock flashcard:', response.error);
    }
  });
};

export const emitTestProgress = (progress: number, userId: string) => {
  const socket = getSocket();
  if (!socket?.connected) {
    console.error('[Client] Socket not connected, cannot emit event');
    // Try to reconnect
    socket?.connect();
    return;
  }

  socket.emit('test:progress', {
    userId,
    progress
  }, (response: { success: boolean, error?: string }) => {
    if (!response.success) {
      console.error('[Client] Failed to update test progress:', response.error);
    }
  });
};

// Connection status
export const isConnected = (): boolean => {
  return socket?.connected || false;
};

// Disconnection
export const disconnect = () => {
  if (socket) {
    console.log('[Client] Disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
}; 