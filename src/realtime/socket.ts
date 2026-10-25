import { io, type Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'wss://realtime.kurio.mock'

/**
 * Um socket por sessão. Token vai na query (o binding de mocks não lê o `auth` do handshake).
 * Só WebSocket: o MSW intercepta WebSocket, não long-polling.
 */
export function createSocket(token: string | null): Socket {
  return io(SOCKET_URL, {
    transports: ['websocket'],
    query: token ? { token } : {},
    reconnectionDelay: 500,
    reconnectionDelayMax: 3000,
  })
}
