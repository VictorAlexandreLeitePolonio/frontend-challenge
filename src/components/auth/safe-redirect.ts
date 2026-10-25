/** Só caminhos internos podem virar destino pós-login (evita open redirect). */
export function safeRedirect(redirect: string | undefined): string {
  return redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'
}

/** Rotas que exigem sessão: nunca são destino ao sair de /login (o guard devolveria ao login). */
const PRIVATE_PATHS = ['/checkout', '/profile', '/wallets', '/orders']

/** Destino ao fechar /login: o redirect só vale se for uma rota pública; senão a home. */
export function publicRedirect(redirect: string | undefined): string {
  const target = safeRedirect(redirect)
  return PRIVATE_PATHS.some((path) => target.startsWith(path)) ? '/' : target
}
