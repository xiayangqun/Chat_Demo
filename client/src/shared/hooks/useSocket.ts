import { useSocketContext } from '../../app/providers/SocketProvider';
import type { Socket } from 'socket.io-client';

export function useSocket(): Socket | null {
  return useSocketContext();
}
