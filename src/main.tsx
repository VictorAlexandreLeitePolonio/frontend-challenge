import './styles.css'

/**
 * O engine.io-client (socket.io-client) captura `globalThis.WebSocket` ao ser avaliado e o MSW só
 * aplica o patch no `worker.start()`. Por isso o socket.io-client é importado sob demanda
 * (realtime/socket.ts), depois da renderização — que só acontece com os mocks ativos.
 */
async function bootstrap() {
  // Sequencial de propósito: sob rede lenta, baixar app e MSW juntos divide a banda e atrasa o LCP.
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { startMocks } = await import('./mocks/browser')
    await startMocks()
  }
  const { renderApp } = await import('./app')
  renderApp()
}

void bootstrap()
