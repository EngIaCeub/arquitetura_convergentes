# 07 — Indicadores e protocolo de avaliação

Versão1 fixada antes das medições G6, após G5 PASS. Skill medir-indicador. Não há participantes humanos; escopo técnico sintético. Indicador oficial PN-PDC3.1.5 permanece “Cadastro nacional criado”, prazo2031; este protótipo não satisfaz sozinho o indicador nacional.

## Pergunta e dados

As consultas retornam exatamente as ofertas esperadas? Qual duração técnica e quantidade de candidatos em relação à listagem completa com as mesmas informações? Base fictícia congelada em evidence/G6/base-congelada.json:4instituições/12ofertas,8tarefas incluindo municípios/UF/categorias, acentos, indisponíveis, inativas, todas e vazio. Gabaritos manuais por ID em tarefas.json. Hashes em protocolo-congelado.json; qualquer alteração exige nova versão de protocolo antes de nova medição. Identidades e ofertas não são dados reais.

Compatibilidade: instituição/oferta ativas, disponibilidade declarada disponível e quantidade>0; filtros AND, texto nome OU recurso normalizado sem acento, município igualdade normalizada. Modos indisponíveis/inativas/todas seguem spec02. Não somar unidades.

## Métodos comparáveis

1. lista_completa_referencia: obter pelo serviço a listagem completa (situacao todas) e selecionar automaticamente os IDs por scanner de referência separado, segundo a tarefa. Recebe todos os campos da mesma base. É referência computacional; não simula tempo humano de inspeção.
2. sistema_filtrado: serviço consultarOfertas com os filtros da tarefa; mesmos dados e contrato. Capturar IDs e comparar conjuntos exatos ao gabarito, independente da ordenação (ordenamento já QA G5).

IndexedDB real em Chromium, mesmo contexto/base/origem e sem alterações durante ensaio. Um ensaio,30repetições por tarefa/método, após3aquecimentos por tarefa/método excluídos. Alternar ordem dos métodos por paridade de tarefa+repetição para reduzir viés de ordem; sem aleatoriedade oculta. Cronometrar performance.now imediatamente antes da consulta até IDs selecionados, sem rede/download/renderização. Registrar480amostras brutas: tarefa, método, repetição, ordem, ms, expectedIds, actualIds, acerto exato, candidatos exibíveis. Referência tem12candidatos completos; sistema tem total filtrado. Base carregada/importada antes do aquecimento, tempo da importação excluído. Hashes source/dist e versão browser/Node no registro; dados brutos vinculados aos hashes do protocolo/base/tarefas.

## Indicadores e aceite

Primário: acerto exato = consultas com conjunto de IDs correto / consultas executadas *100. Rapidez com erro não conta como sucesso. Não liberar G6 com divergência de gabarito sem diagnóstico/correção/reexecução.

Secundários: mediana, p95 (nearest rank ceil(.95*n)-1), mínimo e máximo dos tempos por método/tarefa e agregados. Redução técnica =100*(mediana referência-mediana sistema)/mediana referência, somente referência>0; resultado nulo/negativo preservado. Redução de candidatos =100*(12-total sistema)/12, não é redução de tempo humano e inclui filtros explícitos da tarefa. Amostras repetidas na mesma base não são480usuários nem480casos independentes. Não fazer inferência estatística populacional ou promessa SLA.

Script separado calcula métricas a partir dos dados brutos e verifica hashes/contagens/acertos. Revisor independente confere gabaritos, método, cálculos e alcance antes PASS. Ausência de medição humana deve constar na apresentação.

## Protocolo humano futuro (não executado)

Usar voluntários reais identificados de forma mínima/pseudonimizada, tarefas equivalentes com mesmas informações na lista sem filtros e no sistema. Alternar ordem entre pessoas, usar bases equivalentes para reduzir aprendizagem. Cronometrar início da tarefa até resposta confirmada, registrar acerto/abandono e duração, sem inventar participantes. Comparar tempos apenas de respostas corretas, preservar casos errados e limitações da amostra. Eventual percentual de economia humana somente após essa execução real; nesta versão é hipótese não comprovada.
