# 10 — Publicação Pages

Destino confirmado: EngIaCeub/arquitetura_convergentes, PUBLIC, ADMIN, branch main. URL candidata https://engiaceub.github.io/arquitetura_convergentes/; só declarar publicada após deployment/HTTP verificados. G8 PASS obrigatório antes de publicar.

Workflow planejado: PR executa testes/build; main ou workflow_dispatch executa verify/build → upload artifact dist → deploy → smoke URL. Node24; Playwright1.62.1 desenvolvimento quando browser QA CI. Actions oficiais candidatas checkout@v6, setup-node@v6, configure-pages@v5, upload-pages-artifact@v4, deploy-pages@v4, conferir vigência antes criar. Permissões contents:read, pages:write, id-token:write só deploy; ambiente github-pages e concorrência por ambiente. Nunca publicar PR.

Build com index.html na raiz, imports CSS/JS relativos, hash routing. Sem PDFs, tmp, .agents, secrets, contatos reais ou dependências bundled no artefato. Commit seletivo após revisão; sem force-push/alteração de visibilidade. Site contém somente demo.

Checks G9: SHA checks=SHA artifact/deployment; Actions concluído; URL real retornada, assets sem404, fluxo CRUD e recarga no subpath, armazenamento na origem publicada e perfil independente. Tema/reduced-motion conferidos. Falha de auth/permissão bloqueia; não contornar proteção.

Rollback: selecionar SHA anteriormente aprovado, gerar e publicar dist pelo workflow; preservar schemaDB1 e base local. Reverter frontend não reverte dados do navegador. Exportar antes de atualização; não usar reset automático. Se schema futuro incompatível, impedir escrita e planejar migração separadamente.

## Exceção de sequência — 2026-10-16
Pedido direto do usuário: publicar no GitHub Pages agora. Autoriza executar a publicação técnica antes da conclusão acadêmica G8. G8 permanece PENDING. Demais critérios de segurança, revisão, SHA, deployment e smoke público continuam obrigatórios.
