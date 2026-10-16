# Recuperação da publicação

Primeira publicação: não existia deployment anterior aprovado. O SHA que passar na revisão pública passa a ser a referência inicial; nenhum rollback destrutivo foi executado.

Para corrigir uma regressão futura: identificar o último SHA aprovado em evidence/G9/deployment.json; criar um commit revertendo apenas a alteração causadora em main (`git revert <commit-da-regressao>`), revisar o diff e executar testes/build; enviar sem force-push. O workflow verifica e publica o novo commit, com build-meta.json refletindo esse SHA. Conferir novamente Actions, SHA público e smoke.

Não usar git reset --hard, force-push ou alterar visibilidade/proteções. Reverter frontend não desfaz os dados locais. O sistema atual usa schema IndexedDB 1; manter a compatibilidade. Para atualização incompatível, exportar JSON e planejar migração separada antes de publicar; nunca apagar banco automaticamente.

Backup: exportação/importação JSON validadas em G4/G5 e novamente na revisão pública G9. Arquivos publicados são somente dist, reconstruído a partir da versão do Git.
