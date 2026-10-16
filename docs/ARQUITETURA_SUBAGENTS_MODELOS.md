# Modelos, esforços e subagents — Cadastro de Doadores Institucionais

Data: 2026-10-09. Estado: perfis e skills materializados em P0, com revisão independente por subagent; alocação futura segue este plano. Nenhuma configuração global alterada.
Complementa PLANO_AGENTS_SKILLS_SPECS.md; em matéria de modelos e concorrência, este documento refina o plano anterior.

Publicação acrescentada: [PLANO_DEPLOY_GITHUB_PAGES.md](PLANO_DEPLOY_GITHUB_PAGES.md). Usar serviços JS/IndexedDB, não API HTTP/SQLite. Perfil temporário publicador: gpt-6.1-sol/medium, skill publicar-pages; G9 obrigatório.

Visual: [PLANO_VISUAL_RETRO_NEON.md](PLANO_VISUAL_RETRO_NEON.md). Designer é perfil temporário do especificador (Sol/medium); implementação visual reutiliza implementador (Sol/medium); QA visual reutiliza verificador (Luna/high). Skills definir-identidade-retro-neon e aplicar-tema-e-movimento; nenhuma equipe permanente adicional.

## Decisão proposta

Usar dois modelos principais: `gpt-6.1-sol` para implementação e decisões com dependências; `gpt-6-luna` para tarefas delimitadas e repetíveis. Reservar `gpt-6-astra` para escalonamento excepcional. A escolha é uma hipótese operacional a verificar nos gates iniciais, não um benchmark medido deste projeto.

Os três identificadores estão expostos pelas ferramentas desta sessão. Disponibilidade futura deve ser verificada no momento da execução. Não estimar preço monetário ou economia percentual sem dados de uso e tarifa aplicável. Consumo de assinatura Codex e faturamento de API não são a mesma métrica.

## 1. Análise dos cinco papéis

| Papel | Modelo / esforço inicial | Quando aumentar | Justificativa |
|---|---|---|---|
| Coordenador | gpt-6.1-sol / medium | high para arbitrar contratos incompatíveis ou decisão arquitetural com riscos | Mantém dependências e integração; não precisa de esforço máximo para atualizar status |
| Domínio e evidências | gpt-6-luna / high para extrair fatos; gpt-6.1-sol / medium para consolidar requisitos | Sol / high se houver contradição material nas fontes ou regras | Separar transcrição verificável da interpretação que orientará todo o código |
| Implementação | gpt-6.1-sol / medium | high para migração, integridade ou falha transversal reproduzível | Uma implementação correta evita custo de retrabalho entre armazenamento, serviços e interface |
| Qualidade | gpt-6-luna / high para checklist; gpt-6.1-sol / high para revisão crítica | Astra / low apenas se o impasse relevante persistir após diagnóstico | Revisão de lógica e integridade exige mais profundidade que execução de comandos |
| Entrega | gpt-6-luna / high | Sol / medium para inconsistência entre evidências, indicador e narrativa | Montagem segue rubrica e templates; revisão final permanece independente |

Não são cinco processos permanentes. Domínio e Qualidade têm perfis distintos para tarefas mecânicas e julgamentos. Esforço não é comparável numericamente entre modelos: Luna/high não equivale a Sol/high.

Não usar xhigh, max ou ultra por padrão neste CRUD acadêmico. Não há evidência de que seu custo adicional seja necessário. Modelos antigos disponíveis não entram na configuração inicial: adicionar alternativas sem avaliação amplia manutenção sem economia demonstrada.

## 2. Arquitetura de execução

```text
Coordenador — Sol / medium
  ├── extrator-fontes — Luna / high
  │     skill fundamentar-meta + pdf
  ├── especificador — Sol / medium
  │     skill especificar-contratos
  ├── implementador — Sol / medium
  │     skill implementar-fatia
  ├── verificador — Luna / high
  │     skill validar-gate (checklists e reprodução)
  ├── revisor — Sol / high
  │     skill validar-gate (contratos e casos adversos)
  ├── avaliador — Sol / medium
  │     skill medir-indicador
  └── produtor-entrega — Luna / high
        skill preparar-entrega + presentations + write-like-me
```

São sete perfis reutilizáveis, criados sob demanda, não sete agentes simultâneos. Os subagents não criam outros subagents. O coordenador faz integração, registra aprovação ou falha e controla acesso a arquivos compartilhados. Revisão deve usar contexto próprio e critérios da spec, sem depender do autor para informar o que testar.

Concorrência padrão: coordenador + um trabalhador. Usar dois trabalhadores quando as tarefas tiverem entradas estáveis e arquivos distintos. Limite máximo: coordenador + três trabalhadores, respeitando os quatro slots da sessão; não é uma meta de utilização.

## 3. Skills e contratos de delegação

| Skill proposta | Perfil | Entradas delimitadas | Saídas | Limite de autoridade |
|---|---|---|---|---|
| fundamentar-meta | extrator-fontes | Páginas relevantes dos PDFs, campos exigidos | Fatos, citações por página, ambiguidades | Não inventar problema local comprovado nem interpretar ausência como zero |
| especificar-contratos | especificador | Ficha da meta, escopo, decisões | Specs 01–05, aceitação e contratos | Não ampliar escopo ou trocar stack sem registrar decisão |
| implementar-fatia | implementador | Specs aprovadas e fluxo específico | Código, testes relevantes, instrução de demonstração | Não mudar API/schema silenciosamente nem aprovar o próprio gate |
| validar-gate | verificador/revisor | Checklist, specs, diff e comandos | PASS/FAIL, falhas reproduzíveis e evidências | Não alterar critérios para fazer o teste passar |
| medir-indicador | avaliador | Método aprovado, tarefas e dados brutos | Cálculo reproduzível, acertos, tempos e limites | Não apresentar simulação como benefício humano observado |
| preparar-entrega | produtor-entrega | Rubrica, arquitetura, evidências e aplicação | Slides, roteiro e pacote | Não preencher resultados ausentes com estimativas disfarçadas |

`especificar-contratos` amplia o plano inicial; `publicar-pages` foi acrescentada no ajuste de publicação: concentra regras de dados/API/interface para reduzir divergência. As demais são reutilizadas. Skill não escolhe ou executa modelo por si só; o coordenador associa perfil, modelo e esforço ao despacho.

Skills do ambiente: PDF para fontes/relatório; Presentations para slides; write-like-me para textos em nome do usuário; skill-creator ao criar as skills locais; ferramentas compatíveis de navegador para QA visual. OpenAI Docs é usada na seleção de modelos e configuração, não precisa ser carregada em cada tarefa do produto.

## 4. Distribuição pelos gates

| Gate | Execução | Revisão / saída |
|---|---|---|
| G0 | Extrator, Luna/high | Coordenador confere fonte, alcance e ambiguidades |
| G1 | Especificador, Sol/medium | Revisor, Sol/high, avalia domínio, estados e critérios |
| G2 | Especificador ou implementador, Sol/medium | Revisor, Sol/high, verifica dados/serviços/UI e execução local |
| G3 | Implementador, Sol/medium | Verificador reproduz; revisor examina persistência e integridade |
| G4 | Implementador, Sol/medium | Verificador reproduz filtros/edição; revisor confere mudanças de lógica |
| G5 | Verificador, Luna/high + revisor, Sol/high | Relatório integrado com casos adversos e QA visual |
| G6 | Avaliador, Sol/medium | Coordenador confere método e cálculos com script determinístico |
| G7 | Produtor, Luna/high | Verificador confere rubrica; coordenador confere coerência factual |
| G8 | Verificador, Luna/high | Coordenador confirma pacote, evidências e vídeo final |
| G9 | Publicador (implementador), Sol/medium | Revisor verifica workflow; verificador confere site; coordenador fecha entrega |

Reutilizar uma revisão anterior se os arquivos e critérios relevantes não mudaram. Nova revisão independente somente quando houver novo risco ou alteração pertinente. G3/G4 não exigem auditoria de toda a aplicação a cada mudança.

## 5. Controle de custo e retrabalho

1. Delegar tarefas com saída concreta; não criar agente apenas para repetir o planejamento.
2. Enviar pacote mínimo: objetivo, gate, specs relevantes, arquivos permitidos, critérios e evidências. Evitar herdar toda a conversa e ambos os PDFs em cada chamada.
3. Usar scripts para contagens, fórmulas, validação de schemas e execução de testes. LLM interpreta falhas; não substitui verificações determinísticas.
4. Um escritor por arquivo. Revisores relatam problemas; correções voltam ao implementador.
5. Até duas tentativas direcionadas no mesmo problema. Depois, registrar reprodução, hipótese e evidência; escalar modelo/esforço ou corrigir o requisito. Não repetir o mesmo prompt esperando resultado diferente.
6. Escalonamento sugerido: Luna/high → Sol/medium; Sol/medium → Sol/high; impasse crítico persistente → Astra/low, com tarefa curta e contexto diagnóstico. Falta de dado ou ferramenta não se resolve aumentando esforço.
7. Relatórios de subagents curtos: resultado, arquivos, testes, falhas, pendências. Limite sugerido de 500 palavras, salvo evidência técnica necessária.
8. Encerrar trabalhador sem tarefa pendente; reutilizar contexto somente se o perfil e o par modelo/esforço continuarem adequados.
9. Não agendar reexecuções, publicar serviços ou iniciar uso de API paga como consequência automática deste plano.

Registrar por despacho: perfil, modelo, esforço, duração, resultado, tentativas e tokens quando disponíveis. Registrar consumo da assinatura separadamente e apenas quando observado. Se custo por tarefa não estiver exposto, marcar indisponível, sem inferir preço por token.

A comparação deve considerar custo total até aprovação: primeira execução + correções + revisão. O modelo mais barato por chamada pode ser mais caro por gate se gerar retrabalho.

## 6. Calibração inicial

G0 e G3 funcionam como piloto. Avaliar factualidade, aderência às specs, falhas encontradas na revisão, quantidade de correções e tempo até aprovação. Se Luna produzir extração confiável, mantê-la; se cometer erro factual relevante, migrar aquela tarefa para Sol. Se Sol/medium resolver G3 com revisão aprovada, manter medium nos fluxos seguintes.

Não executar os mesmos gates em vários modelos somente para benchmarking: medir a execução real e ajustar com base nas falhas. A revisão independente é a proteção de qualidade.

## 7. Implementação futura da organização

Adicionar `agents/perfis.yaml` como registro de política, sem supor que seja configuração nativa executável. Campos: id, papel, modelo, esforço, skills, gates, entradas, escrita permitida, saídas e escalonamento. Os prompts continuam em `agents/` e as skills em `.agents/skills/`.

Exemplo de registro, ainda não instalado:

```yaml
id: implementador
model: gpt-6.1-sol
reasoning_effort: medium
skills: [implementar-fatia]
gates: [G3, G4]
max_children: 0
review_required: true
```

O esquema acima é uma convenção deste projeto, não uma promessa de suporte automático. Ao materializar agentes nativos, conferir o formato vigente da configuração do Codex e o mecanismo de descoberta das skills. Nesta sessão, chamadas de spawn permitem model e reasoning_effort explícitos; overrides exigem contexto limitado ou nenhum histórico herdado, acompanhado do pacote de tarefa. Nenhuma mudança de modelo do chat principal é aplicada por editar este documento.

## Fontes e distinção de evidências

- Documentação oficial de subagents: https://learn.chatgpt.com/docs/agent-configuration/subagents — modelos por tarefa, herança e esforço.
- Documentação oficial de raciocínio: https://developers.openai.com/api/docs/guides/reasoning — esforço influencia profundidade, latência e tokens; valores dependem do modelo.
- Disponibilidade local: identificadores e esforços expostos pelas ferramentas desta sessão em 2026-10-09.
- Matriz de alocação, limites de tentativas e organização dos perfis: recomendações específicas para este projeto; ainda não validadas por execução.
