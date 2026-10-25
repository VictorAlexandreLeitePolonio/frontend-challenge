import './styles.css'

/**
 * Os mocks precisam subir ANTES de carregar a aplicação: o engine.io-client (socket.io-client)
 * captura `globalThis.WebSocket` ao ser importado, e o MSW só aplica o patch no `worker.start()`.
 */
async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { startMocks } = await import('./mocks/browser')
    await startMocks()
  }
  const { renderApp } = await import('./app')
  renderApp()
}

void bootstrap()
