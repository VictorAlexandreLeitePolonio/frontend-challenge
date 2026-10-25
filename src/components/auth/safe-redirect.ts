/** Só caminhos internos podem virar destino pós-login (evita open redirect). */
export function safeRedirect(redirect: string | undefined): string {
  return redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'
}
