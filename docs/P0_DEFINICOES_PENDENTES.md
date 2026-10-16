# P0 — Definições para completar a preparação

Estado: contratos implementados em P0: nove skills locais e dez perfis documentais, preservadas as três skills anteriores. Evidências e fechamento em STATUS.md e evidence/P0/. Este documento conserva as definições de aceitação.

## 1. O que falta

- Regras globais em AGENTS.md e template de despacho.
- Seis skills locais adicionais, definidas abaixo.
- Prompts dos perfis e registro de modelo/esforço/responsabilidade.
- STATUS, quadro de tarefas e matriz de rastreabilidade.
- Evidência de validação da preparação, sem aprovar gates do produto.

Não é necessária uma skill extra de orquestração para P0: coordenador executa preparação diretamente, skill-creator materializa skills e validar-gate revisa o resultado. Isso evita circularidade ao exigir uma skill ainda inexistente para criar a própria estrutura.

## 2. Contratos das seis skills pendentes

### fundamentar-meta

Destino: `.agents/skills/fundamentar-meta/SKILL.md`.

- **Descrição de descoberta:** fundamentar problema e meta do PN-PDC no Cadastro de Doadores, extraindo requisitos do enunciado e preservando localizadores, fatos e incertezas.
- **Usar em:** G0, revisão de fontes que afetem requisitos e conteúdo factual de G7. Não usar para inventar diagnóstico municipal.
- **Entradas:** PDFs originais, páginas relevantes, escopo e perguntas da atividade.
- **Procedimento:** ler enunciado completo; mapear 17 itens/rubrica/pitch; conferir linha 3.1.5 e colunas visualmente; registrar objetivo/eixo/prazo/indicador/responsável; separar fato documental, proposta e hipótese; formular problema/público/território sem alegar evidência local ausente.
- **Saídas:** spec 00, ficha oficial e mapa de fontes em evidence/G0; lacunas explícitas.
- **Aceitação:** campos oficiais conferidos e com páginas impressas/digitais; requisitos rastreáveis; nenhum dado inventado; eixo preparação e prazo da meta não deduzidos de exemplos do enunciado.
- **Exemplo de tarefa:** conferir a meta 3.1.5 e preparar a ficha para o protótipo público com base individual no navegador.
- **Limites:** não copiar PDFs para o bundle por padrão; fontes locais primeiro, navegação externa somente se necessária à verificação; não declarar alcance nacional do protótipo.
- **Perfil:** extrator Luna/high; interpretação dos requisitos pelo especificador Sol/medium. Ler skill PDF quando usada para extração/inspeção.

### especificar-contratos

Destino: `.agents/skills/especificar-contratos/SKILL.md`.

- **Descrição de descoberta:** especificar requisitos, dados e interfaces do Cadastro de Doadores estático, mantendo coerência entre domínio, IndexedDB, JSON, telas e GitHub Pages.
- **Usar em:** G1/G2, mudanças de contrato e criação dos registros de perfis em P0.4. Neste último caso, trabalhar com contratos de despacho, sem inventar specs de produto já aprovadas.
- **Entradas:** escopo aprovado, fontes, decisões, requisitos e estrutura existente.
- **Procedimento:** atribuir IDs e aceitação observável; definir instituição/oferta/categorias e estados; resolver duplicidade/unidades/desativação; definir serviços assíncronos e schema JSON versionado; definir transações, seed, migração e armazenamento indisponível; alinhar telas e operação estática; registrar mudanças e impacto.
- **Saídas:** specs 01–06/09/10 conforme task, decisões e matriz de contratos. Spec 11 é produzida pela skill visual e integrada, não duplicada.
- **Aceitação:** cada comportamento obrigatório tem entrada/saída/erro e teste previsto; serviços e UI concordam com dados; Pages não depende de servidor; dados locais e limites de compartilhamento explícitos.
- **Exemplo:** especificar importação JSON atômica com conflitos e validação antes de gravar.
- **Limites:** não criar API HTTP/SQLite como arquitetura padrão; não ampliar escopo, escolher território real ou assumir CNPJ obrigatório sem decisão fundamentada.
- **Perfil:** especificador Sol/medium; revisão Sol/high quando houver contrato crítico.

### implementar-fatia

Destino: `.agents/skills/implementar-fatia/SKILL.md`.

- **Descrição de descoberta:** implementar um fluxo completo do Cadastro de Doadores entre interface, domínio e IndexedDB, incluindo verificações relevantes e compatibilidade com publicação estática.
- **Usar em:** G3/G4 e correções delimitadas em G5. Estilização detalhada usa aplicar-tema-e-movimento.
- **Entradas:** contratos aprovados, task, arquivos sob responsabilidade, comandos e critérios.
- **Procedimento:** verificar dependências do gate; construir um fluxo vertical; validar domínio antes de transação; preservar integridade; tratar erros sem gravação parcial; executar testes relevantes; demonstrar navegador/persistência quando exigidos; documentar qualquer divergência antes de alterar contrato.
- **Saídas:** código, migrações/seed quando pertinentes, testes e demonstração reproduzível; relatório de arquivos, checks e limitações.
- **Aceitação:** fluxo real satisfaz spec; recarga não repõe seed sobre alterações; dados inválidos rejeitados; build usa subpath e funciona sem backend.
- **Exemplo:** cadastrar uma instituição com duas ofertas e comprovar dados após reabertura.
- **Limites:** não aprovar próprio gate; não publicar; não alterar schemas ou critérios silenciosamente; não fazer refatorações alheias à fatia.
- **Perfil:** implementador Sol/medium, high apenas diante de problema transversal reproduzível.

### medir-indicador

Destino: `.agents/skills/medir-indicador/SKILL.md`.

- **Descrição de descoberta:** planejar e medir resultados do Cadastro de Doadores, preservando tarefas equivalentes, dados brutos e separação entre desempenho técnico e avaliação humana.
- **Usar em:** G6 e revisão de resultados que afetem apresentação.
- **Entradas:** versão estável com GV/G5 aprovados, base congelada, pergunta de avaliação e participantes disponíveis quando houver.
- **Procedimento:** fixar protocolo antes de executar; definir oferta compatível e gabarito; comparar lista sem filtros versus sistema com mesmas informações; registrar ordem, tempo, acertos e amostra; usar script para fórmulas; distinguir tempo técnico do tempo humano; analisar aprendizagem e limitações.
- **Saídas:** spec 07, dados brutos sem dados pessoais desnecessários, script de cálculo e relatório em evidence/G6.
- **Aceitação:** cálculos reproduzíveis; referência positiva para percentual de redução; acerto considerado; nenhuma melhoria inventada; resultado pode ser nulo ou negativo sem ser ocultado.
- **Exemplo:** comparar busca por categoria/município em tarefas equivalentes, alternando a ordem entre participantes quando disponíveis.
- **Limites:** teste sintético não comprova benefício humano; ausência de participantes não autoriza gerar pessoas/resultados fictícios; não usar linha de base exemplificativa como medição real.
- **Perfil:** avaliador Sol/medium; cálculos determinísticos revisados pelo coordenador.

### preparar-entrega

Destino: `.agents/skills/preparar-entrega/SKILL.md`.

- **Descrição de descoberta:** montar materiais acadêmicos, roteiro, instruções e pacote do Cadastro de Doadores com rastreabilidade aos 17 itens e às evidências verificadas.
- **Usar em:** G7/G8 e atualização dos links reais em G9.7.
- **Entradas:** rubrica, fontes, versão do sistema, diagrama, evidências, resultados e identificação do integrante quando fornecida.
- **Procedimento:** mapear itens para artefatos; produzir somente formatos escolhidos; usar capturas reais e arquitetura estática atual; elaborar roteiro das cinco perguntas; ensaiar duração; conferir arquivo final de vídeo; montar manifesto, instruções e pacote; revisar alegações e links reais.
- **Saídas:** spec 08, apresentação/documento, roteiro, instruções e pacote em output; vídeo somente se efetivamente gravado.
- **Aceitação:** 17 itens e cinco perguntas cobertos; vídeo <= 5 min; pacote reproduzível; tema e persistência individual explicados; hipótese separada de medição.
- **Exemplo:** montar oito slides e roteiro com demonstração do fluxo de ofertas sem alegar cadastro nacional concluído.
- **Limites:** não inventar integrante, vídeo, resultado ou URL publicada; não enviar mensagens externas nem publicar por esta skill; não incluir PDFs/tmp/segredos indiscriminadamente.
- **Perfil:** produtor Luna/high; revisão factual pelo coordenador. Usar Presentations/PDF/write-like-me conforme o artefato realmente solicitado.

### publicar-pages

Destino: `.agents/skills/publicar-pages/SKILL.md`.

- **Descrição de descoberta:** preparar e executar publicação estática do Cadastro de Doadores no GitHub Pages, com checks prévios, destino confirmado, evidência pública e recuperação.
- **Usar em:** planejamento técnico de G2 e execução G9; preparar workflow não equivale a executar deploy.
- **Entradas:** spec 10, autorização vigente, remote/branch confirmados, artefato validado e versão candidata; G8 PASS para publicar.
- **Procedimento:** verificar credenciais/permissões sem expor segredos; revisar diff e arquivos selecionados; configurar CI e Pages com deploy dependente de checks; conferir base path/artefato; enviar commit; acompanhar run/deployment; obter URL real; delegar/verificar smoke público; registrar rollback para commit aprovado e compatibilidade do IndexedDB.
- **Saídas:** workflow, SHA, branch, URL do run/deployment/site, evidências G9 e procedimento de recuperação.
- **Aceitação:** checks passam; SHA coincide; assets/recarga/fluxo público funcionam; base independente entre perfis documentada; nenhum token no frontend.
- **Exemplo:** publicar artefato estático em EngIaCeub/arquitetura_convergentes e validar o endereço retornado pelo deployment.
- **Limites:** não alterar visibilidade nem remover proteções para contornar falha; não usar force-push; não adicionar todos os arquivos sem inspeção; erro de permissão é bloqueio; se criar PR, anexar ao chat. Nunca declarar sucesso só por push aceito.
- **Perfil:** publicador temporário Sol/medium; revisão de permissões/integração por revisor Sol/high.

## 3. Agentes a materializar

Registros em `agents/perfis.yaml` são política do projeto, não configuração nativa automática. Prompts ficam em `agents/<perfil>.md`. Conferir mecanismo nativo vigente somente se for configurá-lo; não alterar configuração global durante P0.

| Perfil | Modelo / esforço proposto | Skills | Escopo principal |
|---|---|---|---|
| coordenador | gpt-6.1-sol / medium | validar-gate; preparação direta | Integração, STATUS, decisões e gates |
| extrator-fontes | gpt-6-luna / high | fundamentar-meta, PDF | G0 e fontes |
| especificador | gpt-6.1-sol / medium | especificar-contratos | G1/G2 e contratos |
| implementador | gpt-6.1-sol / medium | implementar-fatia, aplicar-tema-e-movimento | G3/G4/GV e correções |
| verificador | gpt-6-luna / high | validar-gate | Reprodução, checklists e capturas |
| revisor | gpt-6.1-sol / high | validar-gate | Integridade e revisão independente |
| avaliador | gpt-6.1-sol / medium | medir-indicador | G6 |
| produtor-entrega | gpt-6-luna / high | preparar-entrega | G7/G8/G9.7 |
| designer | gpt-6.1-sol / medium | definir-identidade-retro-neon | Perfil temporário do especificador em GV |
| publicador | gpt-6.1-sol / medium | publicar-pages | Perfil temporário do implementador em G9 |

Dez perfis documentais incluindo coordenador; designer/publicador são especializações temporárias, não trabalhadores permanentes extras. Não executar todos. P0 usa coordenador e especificador; verificador revisa ao final. Máximo global da sessão é quatro agentes, padrão coordenador + um trabalhador. Nenhum subagent cria descendentes.

Cada prompt deve fixar responsabilidade, entrada mínima, escrita permitida, entregáveis, revisão e limites de ação. Modelo/esforço constam do registro e do despacho, não da skill. Reusar agente somente quando tarefa e configuração permanecerem adequadas.

## 4. Contrato do despacho e do relatório

Despacho: ID, objetivo, gate/dependências, modelo/esforço, skills, arquivos de entrada, escrita permitida, aceitação, comandos e evidência esperada. Relatório: resultado, arquivos, verificações reais, falhas, pendências e recomendação.

Um escritor por arquivo; tarefas independentes podem ser agrupadas no mesmo despacho. Falta de requisito não se resolve com esforço maior; até duas tentativas dirigidas antes de diagnóstico/escalonamento conforme política existente.

## 5. Checklist para fechar P0

| Task | Entrega necessária | Verificação |
|---|---|---|
| P0.1 | Inventário e estado inicial | Arquivos/ferramentas observados e restrições registrados |
| P0.2 | AGENTS.md e template de despacho | Regras coerentes com Pages, GV e gates; nenhuma aprovação fictícia |
| P0.3 | Nove SKILL.md, incluindo três existentes | quick_validate oficial para novas/alteradas; links e fronteiras revistos; descoberta ou leitura explícita demonstrada |
| P0.4 | Prompts e perfis.yaml | Modelos/esforços conferidos; caminhos reais; autoridade e responsabilidades sem conflitos |
| P0.5 | STATUS, quadro, rastreabilidade e review P0 | Tarefas com estado observado, não todas reiniciadas TODO; nenhum requisito obrigatório sem destino; preparação revisada |

Correção ao backlog: tarefas já executadas ou parciais preservam seu estado em P0.5. Não reclassificar criação anterior de skills como trabalho inexistente. P0 só termina com evidências de todos os itens; este documento não fecha P0.
