# Execução G9 — 2026-10-16

- Revisão prévia: revisor independente sem bloqueador no workflow/build/smoke. GitHub confirmou PUBLIC/ADMIN/main; Pages habilitado com build_type workflow, sem alterar visibilidade.
- `node --test tests/*.test.mjs`: 19/19 PASS. `node scripts/build.mjs`: 10 arquivos locais aprovados. CI adicionou metadata com SHA.
- Smoke local: primeiro servidor isolado no sandbox não era acessível ao navegador elevado (timeout); resolvido servindo somente dist em loopback4185 no mesmo contexto. Reexecução PASS. `npx` ausente no PATH local; versão pnpm confirmada por release oficial GitHub e instalação frozen efetivamente PASS no CI.
- Commit seletivo f0c0a02d1fb4c9b1e3b5321ebc3b87e2568d662a enviado sem force-push. PDFs, design, temporários e capturas privadas preservados localmente e excluídos de dist.
- Run38854955465 concluído success: verify (dependências frozen, Chromium, 19 testes, build, smoke local), deploy, smoke público com SHA.
- Deployment7111556290 success; URL retornada pela API e HTTP real. Build-meta público confirma o SHA enviado. Teste Playwright público PASS: cadastro e oferta via UI, reload, filtro, contexto independente, mobile e assets sem404.
- Revisão independente adicional confere bytes públicos contra `git show SHA:path` (normalização LF do Git), edição, cascata, download/importação e reduced-motion computado. Ver reviewer-public.json e review.md.
- Nenhuma avaliação humana ou vídeo gerado. G8 continua PENDING, publicação antecipada solicitada pelo usuário. Recuperação em rollback.md; primeiro deploy aprovado será baseline, sem executar rollback artificial.
