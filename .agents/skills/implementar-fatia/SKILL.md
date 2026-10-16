---
name: implementar-fatia
description: "implementar um fluxo completo do Cadastro de Doadores entre interface, domínio e IndexedDB, incluindo verificações relevantes e compatibilidade com publicação estática."
---

# implementar-fatia

Localizar a raiz do projeto e consultar docs/STATUS.md e as specs pertinentes. Ler docs/P0_DEFINICOES_PENDENTES.md apenas se precisar do contrato completo. Não pressupor existência ou aprovação de entradas ausentes.

- **Usar em:** G3/G4 e correções delimitadas em G5. Estilização detalhada usa aplicar-tema-e-movimento.
- **Entradas:** contratos aprovados, task, arquivos sob responsabilidade, comandos e critérios.
- **Procedimento:** verificar dependências do gate; construir um fluxo vertical; validar domínio antes de transação; preservar integridade; tratar erros sem gravação parcial; executar testes relevantes; demonstrar navegador/persistência quando exigidos; documentar qualquer divergência antes de alterar contrato.
- **Saídas:** código, migrações/seed quando pertinentes, testes e demonstração reproduzível; relatório de arquivos, checks e limitações.
- **Aceitação:** fluxo real satisfaz spec; recarga não repõe seed sobre alterações; dados inválidos rejeitados; build usa subpath e funciona sem backend.
- **Exemplo:** cadastrar uma instituição com duas ofertas e comprovar dados após reabertura.
- **Limites:** não aprovar próprio gate; não publicar; não alterar schemas ou critérios silenciosamente; não fazer refatorações alheias à fatia.

Registrar arquivos, verificações reais, limitações e pendências. Modelos são definidos pelo despacho, não por esta skill.
