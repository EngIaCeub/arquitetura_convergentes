---
name: publicar-pages
description: "preparar e executar publicação estática do Cadastro de Doadores no GitHub Pages, com checks prévios, destino confirmado, evidência pública e recuperação."
---

# publicar-pages

Localizar a raiz do projeto e consultar docs/STATUS.md e as specs pertinentes. Ler docs/P0_DEFINICOES_PENDENTES.md apenas se precisar do contrato completo. Não pressupor existência ou aprovação de entradas ausentes.

- **Usar em:** planejamento técnico de G2 e execução G9; preparar workflow não equivale a executar deploy.
- **Entradas:** spec 10, autorização vigente, remote/branch confirmados, artefato validado e versão candidata; G8 PASS para publicar.
- **Procedimento:** verificar credenciais/permissões sem expor segredos; revisar diff e arquivos selecionados; configurar CI e Pages com deploy dependente de checks; conferir base path/artefato; enviar commit; acompanhar run/deployment; obter URL real; delegar/verificar smoke público; registrar rollback para commit aprovado e compatibilidade do IndexedDB.
- **Saídas:** workflow, SHA, branch, URL do run/deployment/site, evidências G9 e procedimento de recuperação.
- **Aceitação:** checks passam; SHA coincide; assets/recarga/fluxo público funcionam; base independente entre perfis documentada; nenhum token no frontend.
- **Exemplo:** publicar artefato estático em EngIaCeub/arquitetura_convergentes e validar o endereço retornado pelo deployment.
- **Limites:** não alterar visibilidade nem remover proteções para contornar falha; não usar force-push; não adicionar todos os arquivos sem inspeção; erro de permissão é bloqueio; se criar PR, anexar ao chat. Nunca declarar sucesso só por push aceito.

Registrar arquivos, verificações reais, limitações e pendências. Modelos são definidos pelo despacho, não por esta skill.
