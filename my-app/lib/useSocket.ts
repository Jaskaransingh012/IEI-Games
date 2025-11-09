// lib/useSocket.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Role = 'admin' | 'participant';

export function useSocket(opts?: { quizId?: string; role?: Role; user?: any }) {
  const { quizId, role = 'participant', user = null } = opts || {};
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // call the API route once to ensure server is initialized in dev
    fetch('/api/socket').catch(() => {});
  }, []);

  useEffect(() => {
    // connect
    const socket = io({
      path: '/api/socket_io',
      // you can pass auth here if needed: auth: { token }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      if (quizId) {
        socket.emit('join-room', { quizId, role, user });
      }
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // cleanup
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, role]);

  const emit = (event: string, payload?: any) => {
    if (!socketRef.current) return;
    socketRef.current.emit(event, payload);
  };

  const on = (event: string, cb: (...args: any[]) => void) => {
    socketRef.current?.on(event, cb);
    // return off function
    return () => socketRef.current?.off(event, cb);
  };

  return {
    socket: socketRef.current,
    connected,
    emit,
    on,
  };
}
