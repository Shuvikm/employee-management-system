import { io } from 'socket.io-client';
import { API_BASE_URL } from './constants';

export const CLIENT_ID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const socketUrl = import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api$/, '');

export const socket = io(socketUrl, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});
