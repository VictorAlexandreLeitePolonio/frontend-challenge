import { io, type Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'wss://realtime.kurio.mock'

/**
 * Um socket por sessão. Token vai na query (o binding de mocks não lê o `auth` do handshake).
 * Só WebSocket: o MSW intercepta WebSocket, não long-polling.
 */
export function createSocket(token: string | null): Socket {
  return io(SOCKET_URL, {
    // Sem isso o io() reaproveita o Manager em cache para a mesma URL e a query antiga (sem token) seria reutilizada.
    forceNew: true,
    transports: ['websocket'],
    query: token ? { token } : {},
    reconnectionDelay: 500,
    reconnectionDelayMax: 3000,
  })
}
