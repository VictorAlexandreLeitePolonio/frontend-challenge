# Auditoria Lighthouse

Páginas: início (`/`) e detalhe do NFT (`/nft/emerald-ape-042`). Build otimizado (`vite build` + `vite preview`), cenário padrão dos mocks (MSW ativo, como no deploy). Três execuções por página e perfil. A tabela mostra a **mediana**.

| Página | Perfil | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Início | Desktop | 100 | 100 | 100 | 100 | 0,81 s | 0 | 0 ms |
| Detalhe | Desktop | 99 | 100 | 100 | 100 | 0,80 s | 0 | 0 ms |
| Início | Mobile | 89 | 100 | 100 | 100 | 3,42 s | 0 | 12 ms |
| Detalhe | Mobile | 91 | 100 | 100 | 100 | 3,26 s | 0 | 14 ms |

Relatórios HTML/JSON de todas as execuções: `lighthouse-reports/desktop` e `lighthouse-reports/mobile`. Configuração versionada: `lighthouserc.desktop.json` e `lighthouserc.mobile.json`.

## Como reproduzir

```bash
npm ci
npm run lighthouse   # build + 3 execuções por página em cada perfil
```

## Ambiente e condições

- Lighthouse 12.6.1 via `@lhci/cli` 0.15.1, Chrome headless 155, Node 20.19.6, macOS 26.5 (Apple M4).
- Mobile: preset padrão do Lighthouse (Moto G Power emulado, 4G lento simulado: RTT 150 ms, 1,6 Mbps, CPU 4× mais lenta).
- Desktop: preset `desktop` (sem throttling de CPU, 10 Mbps).
- Mocks ativos e imagens/fontes reais da entrega; nenhuma simplificação exclusiva para a auditoria.

## Análise

- **LCP mobile (~3,3 s):** é o caminho crítico de uma SPA com backend simulado no browser. O HTML carrega o bootstrap, que baixa o MSW (~172 KB gzip) e registra o service worker. Só então o app é importado, renderiza e busca `/api/nfts`, e por fim a imagem do primeiro card é pintada. Num backend real, o MSW sairia do caminho crítico.
- **Experimento descartado:** baixar app e MSW em paralelo piorou o LCP mobile (≈4,1 s). Sob banda limitada, os dois disputam a conexão. O carregamento ficou sequencial (ver `src/main.tsx`).
- **Otimizações aplicadas:** `socket.io-client` carregado sob demanda depois da renderização, code-splitting por rota (TanStack Router `autoCodeSplitting`), imagens WebP 640/1080 com `srcset`/`sizes` e dimensões explícitas, `fetchpriority="high"` nos três primeiros cards e na imagem do herói, fonte self-hosted com `font-display: swap`.
- **CLS 0:** skeletons com as mesmas dimensões do conteúdo e `main` com altura mínima de uma tela, para o footer não "pular" quando os dados chegam. Uma primeira medição no detalhe tinha CLS 0,144 por esse motivo.
- **Acessibilidade 100:** a auditoria apontou contraste baixo nos ícones sociais do footer e alvos de toque de 10 px nos pontos dos carrosséis mobile. Os dois foram corrigidos (alvo de 24 px com o ponto visual mantido).
- **SEO 100:** `lang="pt-BR"`, título e descrição, e `robots.txt` válido. Antes, a reescrita da SPA devolvia HTML em `/robots.txt`.

## Rodada de fidelidade ao Figma

A auditoria foi refeita depois da rodada de fidelidade. Duas regressões de acessibilidade no mobile apareceram e foram corrigidas antes de registrar as medianas acima:

- **Contraste do link "EXPLORAR" do herói mobile (3,87:1).** Com o texto curto do Figma, o link passou a ficar sobre o círculo decorativo `#674228`. Recebeu um laranja um tom mais claro (`#f3b06f`, 4,71:1).
- **Alvos de toque de 12 px nos pontos do carrossel do detalhe.** Voltaram a ter 24 × 24 px, com o ponto visual de 7 px dentro.

A variação de 1 ponto na performance mobile da home (90 → 89) está dentro do ruído entre execuções com throttling de 4G lento. O LCP se mantém em ~3,4 s.
