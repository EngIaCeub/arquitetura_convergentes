# Plano de execução — Cadastro de Doadores Institucionais

Estado: nove skills e dez perfis documentais materializados em P0; specs e aplicação continuam pendentes. Inventário em [SKILLS_DO_PROJETO.md](SKILLS_DO_PROJETO.md).

Modelos, esforços, perfis por skill e limites de concorrência são detalhados em [ARQUITETURA_SUBAGENTS_MODELOS.md](ARQUITETURA_SUBAGENTS_MODELOS.md), que refina a política de execução deste plano.

O detalhamento das tarefas, dependências, skills, entregáveis e critérios de aceitação está em [BACKLOG_METAS_TASKS_SKILLS.md](BACKLOG_METAS_TASKS_SKILLS.md).

Publicação no GitHub Pages e arquitetura estática: [PLANO_DEPLOY_GITHUB_PAGES.md](PLANO_DEPLOY_GITHUB_PAGES.md). Este ajuste substitui API HTTP/SQLite por serviços JavaScript/IndexedDB e acrescenta G9 obrigatório.

Identidade visual: [PLANO_VISUAL_RETRO_NEON.md](PLANO_VISUAL_RETRO_NEON.md). Etapa GV entre G4 e G5; antecipar referências/tokens/preview em G2. Duas skills visuais adicionais e spec 11.

## 1. Objetivo e limites

Entregar um protótipo acadêmico funcional, reproduzível e testado, acompanhado dos 17 itens do enunciado e de pitch de até cinco minutos. Uma instituição pode oferecer vários recursos; uma oferta pertence a uma instituição.

O protótipo contribui para a meta 3.1.5 do PN-PDC, sem representar a criação do cadastro nacional oficial. Fonte: PN-PDC, Quadro 6, páginas impressas 114–115 (página digital 58): criar cadastro nacional de doadores institucionais para formar rede para atuar na resposta a desastres; objetivo 3.1; eixo preparação; prazo 2031; indicador cadastro nacional criado; responsável Sedec/MIDR.

Escopo inicial: um município ou região, instituições fictícias claramente identificadas, cadastro/consulta/edição/desativação de instituições e ofertas, filtros, persistência e demonstração local. Sem contato externo ou envio de mensagens. A publicação no GitHub Pages integra a entrega. Login, dados reais e base compartilhada multiusuário pertencem a uma extensão de produção.

Arquitetura para Pages: aplicação estática HTML/CSS/JavaScript, serviços de domínio e IndexedDB no navegador, com importação/exportação JSON. G2 define as ferramentas de build/teste. Dados não são compartilhados entre visitantes; não há API HTTP ou SQLite em servidor. Não adicionar IA, serviços pagos, sensores ou mapas sem requisito demonstrado.

## 2. Estrutura proposta

```text
AGENTS.md                         # regras globais de execução e gates
agents/
  coordenador.md
  dominio-e-evidencias.md
  implementacao.md
  qualidade.md
  entrega.md
.agents/skills/
  fundamentar-meta/SKILL.md
  implementar-fatia/SKILL.md
  validar-gate/SKILL.md
  medir-indicador/SKILL.md
  preparar-entrega/SKILL.md
specs/
  00-escopo-e-fontes.md
  01-requisitos-e-aceitacao.md
  02-dominio-e-dados.md
  03-arquitetura.md
  04-contrato-servicos.md
  05-interface-e-fluxos.md
  06-validacao.md
  07-indicadores.md
  08-entrega-e-pitch.md
  09-operacao-local.md
  10-publicacao-pages.md
  11-design-retro-neon.md
docs/
  STATUS.md
  RASTREABILIDADE.md
  decisions/                      # decisões técnicas e justificativas
evidence/
  G0/ ... G9/                     # relatórios, resultados e capturas
src/                              # organização definida em G2
tests/
scripts/
output/                           # pacote acadêmico final
```

As pastas são uma proposta, não dependem de um framework específico. Prompts em `agents/` não iniciam agentes automaticamente. As skills locais deverão ser criadas e verificadas para descoberta pelo ambiente antes do uso.

## 3. Agentes e responsabilidades

| Papel | Responsabilidade | Escrita permitida por padrão | Critério de conclusão |
|---|---|---|---|
| Coordenador | Decompor tarefas, controlar dependências, resolver decisões, integrar e autorizar avanço dos gates | AGENTS.md, STATUS, rastreabilidade, decisões e integração | Gate completo com evidência e revisão |
| Domínio e evidências | Conferir fontes, formular problema, especificar regras e rastrear requisitos | specs 00–02 e conteúdo de domínio de 07–08 | Requisitos verificáveis e fatos com localizadores |
| Implementação | Construir IndexedDB, serviços e interface por fatias verticais | src, scripts técnicos, testes da fatia e propostas de alterações em 03–05/09 | Fluxo funcional com persistência e testes relevantes |
| Qualidade | Revisar contratos, testar fluxos, acessibilidade e consistência da entrega | spec 06, testes de aceitação e evidence | Relatório independente com falhas e evidências |
| Entrega | Produzir documentação de uso, apresentação, roteiro e pacote | spec 08, documentação de uso e output | 17 itens cobertos e demonstração reproduzível |

Não manter todos os agentes ativos. Limite proposto: até três trabalhadores e um coordenador simultâneos; papéis podem ser reutilizados em turnos diferentes. Implementação não declara seu próprio gate aprovado: Qualidade revisa e Coordenador registra o resultado.

Cada despacho deve conter: objetivo, gate, specs de entrada, arquivos sob responsabilidade, critérios de aceitação, comandos permitidos, dependências e formato do relatório. Resposta obrigatória: arquivos alterados, verificações executadas, resultados, limitações e bloqueios.

## 4. Skills

### Disponíveis no ambiente

- `pdf:pdf`: leitura das fontes e eventual relatório PDF, com renderização quando houver produção de documento.
- `presentations:Presentations`: criação e conferência da apresentação.
- `write-like-me:write-like-me`: redação de relatório e roteiro em nome do usuário.
- `skill-creator`: criação posterior das skills locais descritas neste plano.
- `computer-use:computer-use`: somente se houver superfície de navegador compatível disponível para QA; testes automatizados de domínio, armazenamento e integração continuam necessários.

O destino escolhido é GitHub Pages; usar a skill local proposta publicar-pages. Sites hosting não integra este projeto.

### Skills locais propostas

| Skill | Entrada | Procedimento obrigatório | Saída |
|---|---|---|---|
| fundamentar-meta | PDFs e recorte territorial | Conferir meta, objetivo, eixo, prazo e indicador; separar fato, proposta e hipótese | Ficha da meta, fontes e requisitos |
| implementar-fatia | Contratos aprovados e tarefa delimitada | Implementar um fluxo completo; validar entrada; testar persistência e erros; documentar decisões | Código, testes e demonstração |
| validar-gate | Checklist do gate e artefatos | Conferir evidência, reproduzir verificações e registrar falhas por gravidade | PASS/FAIL, evidências e pendências |
| medir-indicador | Protocolo de comparação | Executar tarefas equivalentes, preservar dados brutos e calcular métricas; identificar participantes ou simulação | Resultados e limites da medição |
| publicar-pages | Build validado e destino confirmado | Conferir permissões, publicar por Actions e testar URL | SHA, run, URL e smoke público |
| preparar-entrega | Rubrica, aplicação e resultados | Rastrear 17 itens, verificar slides, ensaiar pitch e testar pacote em base limpa | Pacote, checklist e roteiro |

Skills descrevem procedimentos reutilizáveis; specs definem o produto; agentes executam tarefas. Não duplicar regras de domínio nas skills.

## 5. Conteúdo mínimo das specs

| Spec | Conteúdo obrigatório |
|---|---|
| 00 | Problema, território, público, ficha oficial da meta, fontes com páginas, hipóteses, escopo e exclusões |
| 01 | Requisitos identificados, histórias, critérios observáveis e prioridade |
| 02 | Entidades, relacionamentos, campos, unidades, duplicidade, estados, atualização e integridade |
| 03 | Componentes, diagrama, responsabilidades, fluxo entrada/processamento/saída e decisão de stack |
| 04 | Interfaces assíncronas de serviços/storage, schemas, filtros, erros, importação/exportação e desativação |
| 05 | Telas, navegação, estados vazios/erro/carregamento, responsividade e teclado |
| 06 | Estratégia de teste, cenários críticos, ambiente e critérios de gravidade |
| 07 | Indicador oficial versus indicador próprio, fórmula, comparação, protocolo, dados brutos e limitações |
| 08 | Matriz dos 17 itens, rubrica, apresentação, roteiro, tempo do vídeo e conteúdo do pacote |
| 09 | Pré-requisitos, build estático, inicialização, migrações IndexedDB, dados fictícios e recuperação |
| 10 | Repositório, base path, Actions, Pages, smoke público, permissões e rollback |

Todo requisito deve ter ID, origem, critério de aceitação, gate e evidência esperada. Specs alteradas após aprovação exigem análise de impacto; contratos de dados e API não podem divergir silenciosamente.

## 6. Gates de execução

| Gate | Trabalho | Responsável principal | Condição para avançar |
|---|---|---|---|
| G0 — Fundamentação | Conferir enunciado e meta; delimitar problema e público | Domínio | Ficha oficial completa; hipóteses separadas de fatos |
| G1 — Requisitos | Especificar fluxos, entidades, regras e aceitação | Domínio + Coordenador | Requisitos rastreáveis, sem dúvidas críticas de domínio |
| G2 — Arquitetura | Definir stack, API, telas, persistência e comandos de execução | Implementação | Contratos coerentes; três componentes com funções distintas; ambiente verificado |
| G3 — Primeira fatia | Cadastrar instituição e oferta, listar e reabrir após reinício | Implementação | Persistência e validação comprovadas; QA independente |
| G4 — Funcionalidade completa | Editar/desativar; filtros combinados; disponibilidade e datas | Implementação | Fluxos e erros atendem aos critérios; sem quebra de integridade |
| GV — Visual retro neon | Aplicar tema escuro, HUD, componentes e transições acessíveis | Designer + Implementação + Qualidade | Spec 11 atendida; contraste, foco, mobile e reduced motion verificados |
| G5 — Qualidade | Testes integrados, navegação, teclado, tela pequena e base limpa | Qualidade | Sem defeitos críticos ou altos; demais pendências explícitas e justificadas |
| G6 — Resultado | Executar comparação e analisar indicador | Qualidade + Domínio | Método e resultados reproduzíveis; natureza sintética/humana declarada |
| G7 — Entrega | Slides/documento, arquitetura, roteiro e pacote | Entrega | 17 itens e rubrica cobertos; roteiro ensaiado para até cinco minutos |
| G8 — Verificação final | Executar pacote em ambiente limpo, conferir arquivos e vídeo | Qualidade + Coordenador | Entrega abre e funciona; vídeo final conferido; STATUS atualizado |
| G9 — Publicação | Publicar no GitHub Pages e validar URL pública | Publicador + Qualidade + Coordenador | Actions/deployment/SHA confirmados, smoke público e links reais |

Não avançar enquanto o gate atual estiver FAIL. Atualizar STATUS com resultado, data, comandos, evidências e pendências. Mudanças posteriores que afetem gate aprovado exigem revalidar a parte impactada. Aprovação de gate é verificação técnica, não pedido obrigatório de confirmação humana.

O vídeo final depende da gravação: roteiro e ensaio não equivalem a vídeo entregue. Caso seja necessária participação do usuário, registrar a dependência sem declarar G8 concluído.

## 7. Paralelismo controlado

- G0–G2: priorizar sequência; decisões do domínio orientam a implementação.
- Após G2: Implementação constrói a fatia; Qualidade prepara cenários a partir dos contratos; Entrega prepara estrutura documental com campos pendentes claramente marcados.
- Após G5: medição e preparação visual podem ocorrer em paralelo, sem inventar resultados.
- G8: revisão final sequencial sobre um único pacote.

Um único agente escreve cada arquivo por vez. Mudanças em schemas ou regras compartilhadas passam pelo coordenador. Não usar agentes diferentes para frontend e backend no início: uma fatia vertical reduz o custo de integração neste projeto pequeno.

## 8. Validação e indicador

Testes essenciais: instituição com múltiplas ofertas; campos obrigatórios; quantidade e unidade; duplicidade conforme regra acordada; edição persistida; desativação sem apagar histórico; filtros combinados; nenhum resultado; banco indisponível; reinício; instalação com dados demonstrativos.

Indicador principal proposto: tempo para localizar oferta compatível, comparando lista sem filtros versus sistema. Indicador complementar: percentual de consultas concluídas corretamente.

Redução percentual = ((tempo de referência − tempo no sistema) / tempo de referência) × 100, para referência maior que zero. Preservar tempos individuais, critério de acerto, tarefas, tamanho da amostra e ordem de execução. Controlar efeito de aprendizagem com tarefas equivalentes e alternância de ordem quando houver participantes.

Não prometer redução antes da medição. Medição sintética verifica funcionamento e desempenho técnico, mas não demonstra benefício real a agentes de Defesa Civil.

## 9. Rastreabilidade e entrega

RASTREABILIDADE deve conter: item do enunciado → requisito → spec → implementação/artefato → teste/evidência → gate.

Cobertura obrigatória: nome, integrante, problema, público, meta, objetivo, eixo, prazo, indicador oficial, solução, entrada/processamento/saída, arquitetura, tecnologias, protótipo, indicador próprio, benefício e limitação/risco. Acrescentar as cinco perguntas do pitch e os nove critérios de avaliação.

Pacote proposto: apresentação ou relatório, código e instruções, base demonstrativa, diagrama, evidências e vídeo de até cinco minutos. O enunciado é ambíguo quanto ao formato único; ZIP é uma opção de organização, não obrigação confirmada.

## 10. Extensão de produção

Uso real é um novo escopo: autenticação e autorização, backend compartilhado, gestão dos contatos, backup/restauração, auditoria, revisão de segurança, confirmação periódica das ofertas e monitoramento operacional. Dados fictícios e execução local não validam essas condições. Nenhuma comunicação com instituições é autorizada por este planejamento.

## Próxima execução

Criar as instruções globais e as specs de G0/G1, conferir os localizadores nas fontes e registrar o primeiro gate. Criar skills locais somente quando seus procedimentos estiverem concretos, usando skill-creator. Não iniciar a aplicação antes de validar requisitos e contratos.
