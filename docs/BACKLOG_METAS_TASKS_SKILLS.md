# Backlog de metas, tarefas e skills

Estado: planejamento detalhado. P0 implementado e aprovado: nove skills criadas/validadas; inventário em [SKILLS_DO_PROJETO.md](SKILLS_DO_PROJETO.md). Resultados por task em TAREFAS.md; produto ainda não iniciado.
Escopo: protótipo acadêmico estático publicado no GitHub Pages do Cadastro de Doadores Institucionais, com dados fictícios, entrega e pitch. Complementa os planos de execução e modelos.

Ajuste vinculante: [PLANO_DEPLOY_GITHUB_PAGES.md](PLANO_DEPLOY_GITHUB_PAGES.md). G9 e sete novas tarefas estão nesse documento. As tarefas originais mantêm seus IDs; API passa a significar contrato interno de serviços, banco passa a IndexedDB.

Etapa visual vinculante: [PLANO_VISUAL_RETRO_NEON.md](PLANO_VISUAL_RETRO_NEON.md). GV possui dez tasks: GV.1–3 em G2 e GV.4–10 após G4; G5 depende de GV PASS.

## Como executar

- Cada gate depende de PASS do anterior. Dentro do gate, seguir as dependências da tabela.
- As nove skills locais foram criadas e validadas estruturalmente em P0; carregar o SKILL.md pertinente antes de usar.
- Nomes abreviados: FM = fundamentar-meta; EC = especificar-contratos; IF = implementar-fatia; VG = validar-gate; MI = medir-indicador; PE = preparar-entrega.
- Perfis/modelos: extrator, verificador e produtor = Luna/high; especificador, implementador, avaliador e coordenador = Sol/medium; revisor = Sol/high. Identificadores completos e escalonamento constam em ARQUITETURA_SUBAGENTS_MODELOS.md. Esta tabela é política proposta, não configuração aplicada.
- Uma tarefa só termina quando seu entregável existe e a condição de aceitação foi verificada. Execução de comando sem analisar o resultado não basta.
- Toda tarefa registra requisito atendido, arquivos alterados, verificação, evidência, limitação e resultado. O coordenador atualiza STATUS e rastreabilidade.
- Uma revisão de fechamento pode cobrir várias tarefas relacionadas; não criar um agente por linha deste backlog.

## P0 — Preparar a execução

Definições das seis skills pendentes, perfis e critérios de fechamento: [P0_DEFINICOES_PENDENTES.md](P0_DEFINICOES_PENDENTES.md).

Meta: tornar instruções, perfis e procedimentos utilizáveis antes de delegar trabalho de produto. P0 não valida G0.

| ID | Tarefa / procedimento | Skill e responsável | Depende de | Entregável e aceitação |
|---|---|---|---|---|
| P0.1 | Inventariar arquivos, instruções existentes e ferramentas; preservar PDFs e alterações do usuário | Coordenador; procedimento de preparação | — | Registro do estado inicial, comandos disponíveis e restrições, sem sobrescrever trabalho existente |
| P0.2 | Materializar regras globais: gates, fontes, evidências, arquivos sob responsabilidade e limites de delegação | Coordenador; procedimento de preparação | P0.1 | AGENTS.md e modelo de despacho coerentes com os planos; nenhum gate automaticamente aprovado |
| P0.3 | Criar nove skills locais com entradas, passos, saídas, exemplos e limites | skill-creator; especificador | P0.2 | SKILL.md de FM, EC, IF, VG, MI, PE, publicar-pages, definir-identidade-retro-neon e aplicar-tema-e-movimento; validação pelo procedimento da skill-creator e teste de descoberta no ambiente; se indisponível, registrar e usar instruções explícitas sem fingir instalação |
| P0.4 | Criar prompts de perfis e registro de modelos/esforços, sem alterar configuração global | EC; especificador | P0.3 | agents/perfis.yaml e prompts; perfis não delegam recursivamente; pares suportados conferidos na execução |
| P0.5 | Inicializar quadro de tarefas, STATUS e matriz de rastreabilidade | VG; verificador + coordenador | P0.4 | Tarefas recebem estado observado, preservando execução parcial anterior; despacho resolve entradas/saídas reais; preparação revisada |

## G0 — Fundamentação e recorte

Meta: estabelecer uma ligação verificável entre problema, público e meta 3.1.5, sem alegar comprovação local inexistente.

Entradas: os dois PDFs originais e os limites acadêmicos acordados.

| ID | Tarefa / procedimento | Skill e responsável | Depende de | Entregável e aceitação |
|---|---|---|---|---|
| G0.1 | Extrair os 17 itens, critérios de avaliação, cinco perguntas do pitch e limite do vídeo | FM + pdf; extrator | P0 | Checklist com páginas do enunciado; quantidades e pesos conferidos |
| G0.2 | Conferir visualmente a linha 3.1.5 e seus campos na tabela oficial | FM + pdf; extrator | P0 | Ficha com descrição, objetivo 3.1, eixo preparação, prazo 2031, indicador e responsável; páginas impressas/digitais identificadas |
| G0.3 | Definir problema, público e território; separar diagnóstico comprovado de cenário hipotético | FM; especificador | G0.1–2 | spec 00: quatro perguntas do problema respondidas; cenário demonstrativo identificado; dados faltantes explícitos |
| G0.4 | Delimitar funcionalidades e exclusões; listar decisões ainda necessárias | EC; especificador | G0.3 | Escopo local, fictício, sem mensagens externas, login ou integração; dúvidas críticas resolvidas ou tratadas como dependência |
| G0.5 | Auditar ficha oficial, requisitos da atividade e alcance das alegações | VG; coordenador | G0.4 | evidence/G0/review.md; sem erro de meta/eixo/prazo; STATUS PASS antes de G1 |

Não confundir cadastro demonstrativo com cadastro nacional criado. Nome do integrante e território real não devem ser inventados; dependências humanas precisam permanecer identificadas.

## G1 — Requisitos e regras de domínio

Meta: transformar o escopo em comportamentos testáveis, com regras de integridade estáveis.

Entradas: G0 PASS e spec 00.

| ID | Tarefa / procedimento | Skill e responsável | Depende de | Entregável e aceitação |
|---|---|---|---|---|
| G1.1 | Identificar ator operador e escrever cenários de cadastrar, consultar, editar e desativar | EC; especificador | G0 | spec 01 com IDs de requisitos e resultados observáveis; prioridade definida |
| G1.2 | Modelar instituição, oferta e categorias; definir campos, tipos, unidades e cardinalidades | EC; especificador | G1.1 | spec 02 com dicionário de dados; uma instituição comporta várias ofertas; oferta exige instituição existente |
| G1.3 | Definir identificador institucional, obrigatoriedade de CNPJ, duplicidade e normalização | EC; especificador | G1.2 | Regra explícita por tipo de instituição; unicidade e mensagens definidas; não usar CNPJ como pressuposto sem decisão |
| G1.4 | Definir disponibilidade, quantidade, atualização e efeito da desativação de instituição | EC; especificador | G1.2 | Tabela de estados e transições; oferta de instituição inativa não aparece como disponível; sem apagar registros por desativação |
| G1.5 | Especificar filtros, ordenação, resultado vazio e critérios para oferta compatível | EC; especificador | G1.3–4 | Exemplos concretos de busca simples/combinada e regra de inclusão; quantidade não combina unidades incompatíveis |
| G1.6 | Escrever aceitação positiva/negativa e riscos do uso local | EC; especificador | G1.5 | Cada requisito ligado a teste esperado; contatos fictícios e ausência de autenticação delimitados |
| G1.7 | Revisar completude e contradições; registrar decisões de domínio | VG; revisor + coordenador | G1.6 | Review G1; regras críticas sem ambiguidade; specs 01/02 e STATUS aprovados |

## G2 — Arquitetura, contratos e operação

Meta: definir três componentes tecnológicos e garantir contratos coerentes e ambiente viável.

Entradas: G1 PASS e specs 00–02.

| ID | Tarefa / procedimento | Skill e responsável | Depende de | Entregável e aceitação |
|---|---|---|---|---|
| G2.1 | Verificar runtimes e escolher stack com poucas dependências | EC; implementador | G1 | Decisão técnica com comandos reais, versões observadas e justificativa; sem backend remoto; base path e build estático definidos |
| G2.2 | Desenhar interface, serviços JS, IndexedDB, intercâmbio JSON e fluxo de dados | EC; especificador | G2.1 | spec 03 e diagrama; cada componente tem função; entrada/processamento/saída exemplificados |
| G2.3 | Fixar contrato de serviços assíncronos, schemas, filtros, estados e erros | EC; especificador | G2.2 | spec 04 de serviços/storage e JSON; exemplos válidos/inválidos; sem rotas HTTP; IDs e regras correspondem à spec 02 |
| G2.4 | Desenhar navegação, formulários, consulta, detalhe e feedback | EC; especificador | G2.3 | spec 05 com fluxos e estados vazio/erro/carregamento; campos e ações compatíveis com API |
| G2.5 | Planejar criação do banco, migrações, seed fictício e comandos de execução | EC; implementador | G2.3 | spec 09; nome/versionamento do IndexedDB, política de seed e comportamento na recarga definidos; reset somente da base demonstrativa explicitamente indicada |
| G2.6 | Definir cenários críticos, ferramenta de teste e critérios de gravidade | VG; verificador | G2.3–5 | spec 06 com matriz requisito/teste; testes de persistência e fluxo real, sem duplicar apenas a implementação |
| G2.7 | Conferir coerência entre domínio, API, telas e operação | VG; revisor + coordenador | G2.6 | Review G2; contratos versionados; nenhuma dependência essencial sem solução; STATUS PASS |

Não construir o produto durante G2. Verificação mínima do ambiente é permitida; implementação de aplicação começa em G3.

## G3 — Primeira funcionalidade de ponta a ponta

Meta: cadastrar uma instituição e suas ofertas pelo navegador, consultar e comprovar persistência após reinício.

Entradas: G2 PASS, specs aprovadas e runtime disponível.

| ID | Tarefa / procedimento | Skill e responsável | Depende de | Entregável e aceitação |
|---|---|---|---|---|
| G3.1 | Criar estrutura da aplicação e comandos reproduzíveis | IF; implementador | G2 | Aplicação inicia localmente; dependências declaradas; instruções executáveis |
| G3.2 | Criar banco e estruturas com restrições de integridade | IF; implementador | G3.1 | Migração inicial aplicada em banco vazio; vínculo instituição/oferta protegido pelo banco quando aplicável |
| G3.3 | Implementar cadastro e consulta de instituições e ofertas nos serviços e IndexedDB | IF; implementador | G3.2 | Operações conforme contrato; validação de domínio antes da transação; dados inválidos não persistem |
| G3.4 | Implementar formulários e listagem conectados aos serviços | IF; implementador | G3.3 | Cadastro pelo navegador retorna dados persistidos; formulário informa erros sem perder indevidamente campos |
| G3.5 | Criar seed fictício determinístico na primeira inicialização e identificar modo demonstrativo | IF; implementador | G3.4 | Base de exemplo sem contatos reais; execução repetida segue comportamento documentado, sem duplicação inesperada |
| G3.6 | Executar fluxo com duas ofertas para uma instituição e reiniciar | VG; verificador | G3.5 | Evidência de dados antes/depois do reinício; duas ofertas preservadas e vinculadas corretamente |
| G3.7 | Revisar validação, persistência e integridade; corrigir falhas e revalidar | VG + IF nas correções; revisor/implementador/coordenador | G3.6 | Tests relevantes passam; Review G3; custo/retrabalho observado registrado; STATUS PASS |

## G4 — Funcionalidades completas do protótipo

Meta: permitir manter cadastros e localizar ofertas compatíveis sem corromper dados ou exibir disponibilidade indevida.

Entradas: G3 PASS.

| ID | Tarefa / procedimento | Skill e responsável | Depende de | Entregável e aceitação |
|---|---|---|---|---|
| G4.1 | Implementar edição de instituição e oferta em serviços e interface | IF; implementador | G3 | Alterações válidas persistem; conflito de duplicidade tratado; erro não altera parcialmente o registro |
| G4.2 | Implementar desativação e regras de disponibilidade | IF; implementador | G4.1 | Dados preservados; instituição inativa não fornece oferta disponível na busca padrão; reativação somente se prevista na spec |
| G4.3 | Implementar filtros combinados, ordenação e limpeza de filtros | IF; implementador | G4.2 | Município/categoria/disponibilidade combinam conforme contrato; resultado comparável à base conhecida |
| G4.4 | Completar detalhes, unidades, datas e estados da interface | IF; implementador | G4.3 | Contato fictício, quantidade e atualização legíveis; mensagens de vazio/erro/carregamento verificadas |
| G4.5 | Testar edição, desativação, filtros e reinício em conjunto | VG; verificador | G4.4 | Matriz de cenários executada; nenhuma perda ou associação incorreta; evidências G4 |
| G4.6 | Revisar mudanças de lógica e fechar o gate | VG; revisor + coordenador | G4.5 | Requisitos de G4 satisfeitos; correções revalidadas; STATUS PASS |

### Tarefas adicionais de G4 para publicação

| ID | Tarefa / procedimento | Skill e responsável | Depende de | Entregável e aceitação |
|---|---|---|---|---|
| G4.7 | Implementar exportação/importação JSON versionado | IF; implementador | G4.4 | Round-trip preserva relações; arquivo inválido rejeitado sem gravação parcial; conflitos tratados conforme spec |
| G4.8 | Implementar restauração demonstrativa e falha de armazenamento | IF + VG; implementador/verificador | G4.7 | Confirmação explícita antes de substituir base; erro controlado; recarga/deploy não sobrescreve cadastros |

G4.6 fecha somente após G4.8; G5 inclui migração, JSON inválido, campos maliciosos, subpath e persistência na origem publicada. G2.7 exige spec 10 com plano de workflow/rollback antes da implementação.

## G5 — Qualidade e reprodução

Meta: demonstrar que o sistema atende aos contratos e funciona pelos fluxos reais, sem defeitos críticos ou altos.

Entradas: G4 PASS e spec 06.

| ID | Tarefa / procedimento | Skill e responsável | Depende de | Entregável e aceitação |
|---|---|---|---|---|
| G5.1 | Executar testes automatizados relevantes e analisar falhas | VG; verificador | G4 | Resultado completo, ambiente e comandos registrados; cobertura por requisito, não só contagem de testes |
| G5.2 | Testar entradas adversas, referências inválidas, duplicidade e falha do banco | VG; revisor | G5.1 | Sem corrupção; falhas previsíveis produzem resposta controlada; dados técnicos sensíveis não expostos em mensagens |
| G5.3 | Exercitar fluxos pelo navegador em computador e tela pequena | VG + ferramenta de navegador compatível; verificador | G5.1 | Cadastro/edição/busca/desativação reais; sem controles inacessíveis por corte de layout |
| G5.4 | Verificar teclado, foco, rótulos e comunicação de erros | VG; verificador | G5.3 | Fluxos principais executáveis por teclado; campos rotulados; ausência de dependência exclusiva de cor |
| G5.5 | Reproduzir instalação e inicialização em diretório/base limpos | VG; verificador | G5.2–4 | Sem dependência oculta da base de desenvolvimento; instruções da spec 09 suficientes; não apagar workspace original |
| G5.6 | Corrigir defeitos, reexecutar cenários afetados e consolidar QA | IF + VG; implementador/verificador/coordenador | G5.5 | Sem defeito crítico/alto; demais pendências com impacto e justificativa; STATUS PASS |

Se não houver navegador utilizável, registrar impedimento de QA visual, sem substituir essa evidência por testes de API. Falhas de ferramentas não justificam declarar gate aprovado.

## G6 — Indicador e resultados

Meta: apresentar medida reproduzível de desempenho, distinguindo hipótese, resultado técnico e avaliação humana.

Entradas: G5 PASS e aplicação estável.

| ID | Tarefa / procedimento | Skill e responsável | Depende de | Entregável e aceitação |
|---|---|---|---|---|
| G6.1 | Definir tarefa de busca, compatibilidade, indicador e protocolo | MI; avaliador | G5 | spec 07 com tempo e acertos; mesmas informações para lista sem filtro e sistema; amostra e exclusões definidas antes de medir |
| G6.2 | Preparar cenários equivalentes e base congelada | MI; avaliador | G6.1 | Gabarito de ofertas compatíveis, versão da base e tarefas preservados; reduzir aprendizagem com ordem alternada quando houver pessoas |
| G6.3 | Executar medição e registrar dados brutos | MI; avaliador | G6.2 | Registro de duração, acerto, cenário, método e execução; participantes somente se realmente disponíveis; sintético explicitamente rotulado |
| G6.4 | Calcular métricas com script e interpretar limites | MI; avaliador | G6.3 | Cálculo reproduzível; referência positiva na fórmula de redução; rapidez sem acerto não conta como sucesso; sem percentuais inventados |
| G6.5 | Revisar método, resultados e afirmações autorizadas | VG; coordenador | G6.4 | Resultados separados do indicador oficial; se apenas sintético, sem alegar benefício humano; STATUS PASS no alcance observado |

Se não houver avaliação humana, tempo técnico de consulta não substitui tempo de uma pessoa para localizar oferta. Documentar indicador humano como protocolo futuro e apresentar apenas o que foi medido.

## G7 — Materiais acadêmicos

Meta: produzir materiais que cubram os 17 itens e as cinco perguntas do pitch, coerentes com o que foi implementado e medido.

Entradas: G6 PASS, fontes, arquitetura, capturas e resultados.

| ID | Tarefa / procedimento | Skill e responsável | Depende de | Entregável e aceitação |
|---|---|---|---|---|
| G7.1 | Mapear 17 itens e critérios para artefatos finais | PE; produtor | G6 | spec 08 e rastreabilidade; nenhum item omitido; nome/integrante sem invenção |
| G7.2 | Preparar diagrama final, capturas e roteiro de demonstração | PE; produtor | G7.1 | Diagrama corresponde ao código; capturas do sistema final com dados fictícios; sequência demonstra entrada/processamento/saída |
| G7.3 | Criar apresentação e documento apenas no formato escolhido | PE + Presentations; PDF se houver relatório; write-like-me para redação; produtor | G7.2 | Artefatos renderizados e inspecionados; texto legível; citações e indicador consistentes; não gerar formatos redundantes sem necessidade |
| G7.4 | Escrever roteiro de até cinco minutos e ensaiar | PE + write-like-me; produtor | G7.3 | Cinco perguntas respondidas; duração registrada; reservar tempo para demonstração, sem equiparar roteiro a vídeo |
| G7.5 | Revisar rubrica, linguagem e limites das alegações | VG; verificador + coordenador | G7.4 | 17 itens cobertos; pesos conferidos; nenhum resultado simulado como real; STATUS PASS dos materiais |

## G8 — Pacote final e vídeo

Meta: entregar um pacote que outra pessoa consiga abrir e executar, incluindo vídeo final de até cinco minutos.

Entradas: G7 PASS e versão final do sistema.

| ID | Tarefa / procedimento | Skill e responsável | Depende de | Entregável e aceitação |
|---|---|---|---|---|
| G8.1 | Gravar e conferir o pitch com demonstração | PE; produtor + usuário se necessário | G7 | Arquivo de vídeo real, duração até 5 min, áudio compreensível, cinco respostas e tela legível; necessidade de gravação humana registrada |
| G8.2 | Montar código, instruções, base fictícia e materiais em pacote único escolhido | PE; produtor | G8.1 | Manifesto dos arquivos; sem segredos, banco real, caches ou dependências dispensáveis; formato de entrega documentado |
| G8.3 | Extrair em pasta nova e seguir as instruções de execução | VG; verificador | G8.2 | Sistema inicia e fluxo principal funciona; apresentação/documento e vídeo abrem; manifesto corresponde ao pacote |
| G8.4 | Conferir cobertura final e consolidar status | VG; coordenador | G8.3 | Evidências G8, pendências finais e checklist; todos os requisitos obrigatórios atendidos para PASS; pacote vinculado à versão conferida |

Se faltar vídeo, integrante obrigatório ou evidência necessária, G8 permanece pendente. Não fabricar dado para fechar entrega. Corrigir qualquer arquivo após G8.3 exige repetir a verificação pertinente e reconstruir o pacote.

## Cobertura do enunciado

| Item | Conteúdo | Tarefas responsáveis |
|---|---|---|
| 1–2 | Nome do projeto e integrante | G0.4, G7.1, G8.4 |
| 3–4 | Problema e público | G0.3, G7.3 |
| 5–9 | Meta, objetivo, eixo, prazo, indicador oficial | G0.2, G7.3 |
| 10–11 | Solução e entrada/processamento/saída | G1.1, G2.2, G3.4, G7.2 |
| 12–13 | Arquitetura e tecnologias | G2.1–3, G7.2–3 |
| 14 | Protótipo | G3–G5, G7.2, G8.3 |
| 15 | Indicador da solução | G6.1–5, G7.3 |
| 16–17 | Benefício e limitação/risco | G1.6, G6.5, G7.3–5 |
| Pitch | Cinco perguntas e vídeo até 5 min | G7.4, G8.1 |

## Contrato de uma task

```yaml
id: G3.6
status: TODO
goal: Comprovar persistencia de uma instituicao com duas ofertas apos reinicio
owner: verificador
model: gpt-6-luna
reasoning_effort: high
skills: [validar-gate]
depends_on: [G3.5]
inputs: [specs/02-dominio-e-dados.md, specs/06-validacao.md, specs/09-operacao-local.md]
write_scope: [evidence/G3/]
acceptance:
  - Instituicao e duas ofertas preservadas apos reinicio
  - Vinculos e valores iguais aos registrados antes do reinicio
evidence: [evidence/G3/persistencia.md]
reviewer: coordenador
```

Convenção proposta do projeto, não arquivo de configuração nativa do Codex. STATUS por tarefa: TODO, DOING, BLOCKED, REVIEW, DONE. BLOCKED identifica dependência concreta; DONE exige aceite e evidência. Gate usa PENDING, PASS ou FAIL. Um gate com tarefa bloqueada não avança.

## Critério de economia

Usar um despacho por conjunto coerente de tarefas, sem agente novo para cada item. Exemplos: extrator cobre G0.1–2; especificador cobre G1.1–6; implementador cobre G3.1–5; produtor cobre G7.1–4. Reviews de fechamento são independentes. Toda tarefa continua rastreável mesmo quando agrupada.

Paralelizar apenas dentro do gate com entradas estáveis e arquivos distintos. São 76 tarefas: 59 neste backlog, dez de GV no plano visual e sete de G9 no plano de publicação. Não transformar cada tarefa em um contexto completo. A política é reduzir despachos, não reduzir verificação.
