# 09 — Operação local

Node >=24, build/servidor/testes domínio sem dependências externas. Comandos implementados: node scripts/build.mjs; node scripts/serve.mjs (porta4175); node --test; node tests/browser.mjs. QA usa Playwright1.62.1 instalado como dependência de desenvolvimento ou runtime bundled via PLAYWRIGHT_MODULE; nunca incluído em dist.

IndexedDB cadastro-doadores-institucionais versão1, store estado keyPath chave; snapshot e meta conforme spec03. Abrir DB ausente cria store; seed inicial é transação única se ambos registros ausentes. Meta sem snapshot ou vice-versa é STORAGE_ERROR (não resetar). Meta inicializada e base vazia intencional não recebem seed. Versão futura gera VERSION_UNSUPPORTED. Não há migração destrutiva; futuras versões exigem migração e testes próprios. versionchange fecha conexão; blocked orienta fechar outras abas e não grava.

Seed fictício determinístico: pelo menos duas instituições e três ofertas, uma instituição com duas ofertas; IDs/data fixos canônicos. Instituições com contato example.org; rótulo de demonstração em UI. Reabrir/recarregar/deploy não altera dados.

Servir HTTP, nunca file://. Build em dist copia somente index.html/src e assets públicos por allowlist. JSON import/export transfere entre perfis/origens; sem backend. Reproduzir em pasta nova somente código necessário, sem PDFs privados/caches. Exportação recomendada antes de restauração/importação/atualização.

Instalação QA reproduzível: pnpm11.25.0 install --frozen-lockfile; pnpm exec playwright install chromium. Lockfile pnpm-lock.yaml gerado. Aplicação/build/testes domínio usam somente Node; Playwright é devDependency fixa1.62.1, sem inclusão em dist. Runtime bundled observado foi usado para testes locais.

QA: com servidor dist ativo (node scripts/serve.mjs, porta4175), execute node tests/browser.mjs. Variáveis opcionais APP_URL para origem/subpath, PLAYWRIGHT_MODULE para URL file de pacote bundled e PLAYWRIGHT_BROWSERS_PATH para cache; instalação normal via pnpm não exige PLAYWRIGHT_MODULE. Servidor serve exclusivamente dist, sem documentos/fontes privadas.
