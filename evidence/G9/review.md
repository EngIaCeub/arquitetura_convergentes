# Revisão independente G9

Parecer final em 2026-10-16: **PASS técnico da publicação G9** para f0c0a02d1fb4c9b1e3b5321ebc3b87e2568d662a. Deployment, SHA e smoke público conferidos; nenhuma falha crítica/alta observada. A entrega acadêmica G8 continua PENDING.

Revisor: subagent independente, perfil revisor, gpt-6.1-sol/high. Skills lidas: `validar-gate` e `publicar-pages`; critérios: spec 10 e plano de publicação. Escopo de escrita limitado a este parecer e checks independentes em evidence/G9. Nenhuma alteração de produto/workflow pelo revisor.

## Versão e ambiente

- Base inicial: 145b3786be72efd7baf6981c6471733d21f57517; candidato commitado e revisado: f0c0a02d1fb4c9b1e3b5321ebc3b87e2568d662a.
- Windows/PowerShell, Node v24.19.0; Chromium 151.0.7922.34.
- Exceção à sequência G8→G9 documentada em spec 10 e evidence/G9/autorizacao.md por pedido direto do usuário em 2026-10-16. G8 continua PENDING; esta revisão não valida vídeo nem entrega acadêmica final.

## Verificações executadas

1. `node --test tests/*.test.mjs`: **19/19 PASS**, sem falha/cancelamento/skip. Cobertura inclui integridade, inicialização idempotente, edição, cascata, revisão concorrente, export/import, preservação após erro e limites.
2. Leitura independente de `.github/workflows/pages.yml`: PR roda checks/build mas não configure/upload/deploy; deploy exige verify e branch main; somente o job deploy recebe pages:write e id-token:write; contents:read global; verify recebe adicionalmente pages:read para configure-pages; ambiente github-pages; actions oficiais fixadas por SHA. Não há segredo no frontend nem comando de force-push/alteração de visibilidade.
3. Leitura de `scripts/build.mjs`: cópia explícita de index.html/src, .nojekyll e build-meta.json condicionado a SHA válido; dist tratado com guarda contra symlink; extensões limitadas. Inventário de dist inspecionado: 10 arquivos locais antes da metadata CI, sem PDF, fontes privadas, evidence, .agents ou dependências.
4. Leitura de src/index: seed com DEMO e example.org, sem dados reais observados; importações relativas e hash routing; IndexedDB schema1. Nenhuma mudança de esquema nesta publicação.
5. Leitura de `tests/g9-smoke.mjs`: teste sintético de cadastro/oferta, recarga, filtro, outro contexto e mobile; metadados de SHA quando EXPECTED_SHA existe. Check independente adicional preparado em reviewer-public.mjs para verificar também edição, cascata, export/import, bytes de assets e reduced-motion computado.

## Verificação pública independente

- [Site verificado](https://engiaceub.github.io/arquitetura_convergentes/): HTTPS 200, interface inicial carregada, metadata SHA coincidente. **Os nove arquivos HTML/CSS/JS publicados têm SHA256 idêntico aos blobs do commit aprovado**.
- [Actions 38854955465](https://github.com/EngIaCeub/arquitetura_convergentes/actions/runs/38854955465): completed/success, headSha coincidente, conforme actions.json. Deployment 7111556290 registra o mesmo SHA/main; deployment-statuses.json registra success e retorna a URL real acima.
- `reviewer-public.json`: PASS em 2026-10-16T05:18:58.858Z. Cadastro de instituição/oferta pela UI, edição de quantidade para 27, recarga preservando o valor, filtro municipal com um resultado, desativação de instituição propagada à oferta sem perda de quantidade, download real de JSON e importação em outro contexto limpo. O segundo contexto inicia com apenas duas instituições seed, confirmando isolamento antes da importação.
- Captura `reviewer-public-mobile.png` inspecionada visualmente a 360px: tema retro neon, aviso de dados fictícios/locais, formulário e resultado legíveis, sem transbordamento horizontal observado. Reduced motion confirmado por transitionDuration computado 0s no botão. Nenhum pageerror ou HTTP>=400 observado no fluxo.
- Recuperação em `rollback.md` revisada: primeiro deploy sem predecessor, este SHA passa a baseline; regressões futuras são revertidas por commit e checks, sem force-push. Schema IndexedDB1 preservado; rollback de frontend não desfaz dados locais. Export/import repetidos no teste público.

Comando reproduzível do check independente (PowerShell, executar da raiz):

```powershell
$env:APP_URL='https://engiaceub.github.io/arquitetura_convergentes/'
$env:EXPECTED_SHA='f0c0a02d1fb4c9b1e3b5321ebc3b87e2568d662a'
$env:PLAYWRIGHT_MODULE='file:///C:/Users/felip/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
$env:PLAYWRIGHT_BROWSERS_PATH='C:/Users/felip/AppData/Local/ms-playwright'
node evidence/G9/reviewer-public.mjs
```

Ocorrências do ambiente/check: a primeira tentativa exigiu apontar o cache de browser do usuário; o sandbox bloqueava DNS e a execução pública passou com escalada autorizada. Comparar com arquivos locais gerou diferença CRLF/LF (core.autocrlf true), então o check foi corrigido para comparar exatamente com `git show SHA:path`. A execução final passou sem diferenças. Nenhuma destas ocorrências demonstrou falha de produto.

## Limitações e consolidação

PASS restrito à publicação técnica solicitada. Verificações são automação sintética em Chromium e inspeção de captura, com contextos isolados representando perfis; não demonstram benefício humano, compatibilidade universal ou auditoria completa WCAG. Não existe vídeo real validado nem ZIP final G8 validado. Não foi executado rollback destrutivo no primeiro deploy.

O coordenador consolida STATUS, rastreabilidade e links reais; eventual commit documental posterior não altera o SHA do artefato efetivamente revisado. Material/apresentação histórica pode receber complemento com a URL real, sem reescrever resultados sintéticos anteriores.
