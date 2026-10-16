---
name: especificar-contratos
description: "especificar requisitos, dados e interfaces do Cadastro de Doadores estático, mantendo coerência entre domínio, IndexedDB, JSON, telas e GitHub Pages."
---

# especificar-contratos

Localizar a raiz do projeto e consultar docs/STATUS.md e as specs pertinentes. Ler docs/P0_DEFINICOES_PENDENTES.md apenas se precisar do contrato completo. Não pressupor existência ou aprovação de entradas ausentes.

- **Usar em:** G1/G2, mudanças de contrato e criação dos registros de perfis em P0.4. Neste último caso, trabalhar com contratos de despacho, sem inventar specs de produto já aprovadas.
- **Entradas:** escopo aprovado, fontes, decisões, requisitos e estrutura existente.
- **Procedimento:** atribuir IDs e aceitação observável; definir instituição/oferta/categorias e estados; resolver duplicidade/unidades/desativação; definir serviços assíncronos e schema JSON versionado; definir transações, seed, migração e armazenamento indisponível; alinhar telas e operação estática; registrar mudanças e impacto.
- **Saídas:** specs 01–06/09/10 conforme task, decisões e matriz de contratos. Spec 11 é produzida pela skill visual e integrada, não duplicada.
- **Aceitação:** cada comportamento obrigatório tem entrada/saída/erro e teste previsto; serviços e UI concordam com dados; Pages não depende de servidor; dados locais e limites de compartilhamento explícitos.
- **Exemplo:** especificar importação JSON atômica com conflitos e validação antes de gravar.
- **Limites:** não criar API HTTP/SQLite como arquitetura padrão; não ampliar escopo, escolher território real ou assumir CNPJ obrigatório sem decisão fundamentada.

Registrar arquivos, verificações reais, limitações e pendências. Modelos são definidos pelo despacho, não por esta skill.
