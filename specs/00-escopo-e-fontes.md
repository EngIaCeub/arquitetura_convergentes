# 00 — Escopo e fontes

Estado: G0 PASS após revisão independente do caso RS/2024; não constitui aprovação de G1 ou implementação.
Nome de trabalho: Cadastro de Doadores Institucionais. Integrante: Felipe Paz Santiago (informado diretamente pelo usuário em 2026-10-10).

## Problema e cenário

**O que acontece?** Na resposta às enchentes do Rio Grande do Sul em 2024, foi necessário padronizar o fluxo e o canal de pedidos de doações, definir prioridades e organizar informações de local e público atendido. Essa necessidade administrativa real está explicitada na Orientação Operacional nº 01/2024 da SERS. O problema adotado é a necessidade de organizar informações de doações para apoiar sua coordenação em desastres; não há alegação de ausência de sistema, registros dispersos ou atraso medido.

**Quem é afetado?** Na fonte, equipes que recebem e analisam pedidos, Prefeituras e instituições de assistência humanitária, com atendimento às vítimas do desastre. Para o protótipo, o público direto é o operador de Defesa Civil que mantém e consulta instituições ofertantes e seus recursos; os doadores são entidades representadas no cadastro. Beneficiários finais são indiretos esperados, sem entrevistas ou avaliação realizada.

**Onde ocorre?** Contexto histórico real: Rio Grande do Sul, desastres climáticos a partir de 30/04/2024. Não se atribui diagnóstico a município específico. A demonstração usará instituições, ofertas e localidades fictícias, explicitamente identificadas, sem reproduzir cadastros reais.

**Por que Computação ajuda?** Validação, armazenamento e filtros podem estruturar informações de instituições e ofertas por categoria, município e disponibilidade. Facilidade e rapidez de consulta são hipóteses para medir em G6; não há benefício operacional demonstrado.

### Fonte do caso e ponte para a solução

[Orientação Operacional nº 01/2024 — Governo Federal](https://www.gov.br/reconstrucaors/pt-br/central-de-conteudo/documentos/orientacao-operacional-no-01-2024), publicada em 11/06/2024; página atualizada em 23/02/2026; consultada em 09/10/2026. Localizadores: dois considerandos iniciais; itens 1, 3, 4(a) e 6.

A fonte regula **pedidos**, incluindo canal, iniciativa/local/público e consulta de disponibilidade. O protótipo demonstra somente a organização do lado das **ofertas institucionais**, associada à meta 3.1.5. Essa contribuição parcial é uma inferência de projeto: consultar quem oferece determinado recurso apoia a organização informacional, mas não substitui pedidos, prioridades, análise oficial, transparência institucional ou entrega. Não haverá módulo de pedidos ou integração SERS. O usuário selecionou este caso em 09/10/2026.

## Vínculo oficial

Fonte: PN-PDC, Quadro 6, página digital 58, impressas 114–115. Conferência completa em evidence/G0/ficha-meta.md.

| Campo | Referência documental |
|---|---|
| Meta | 3.1.5 — Criar cadastro nacional de doadores institucionais para formar rede para atuar na resposta a desastres. |
| Objetivo | 3.1 — Aprimorar as capacidades de atuação na resposta a desastres. |
| Eixo marcado na linha da meta | Preparação |
| Prazo marcado | 2031 |
| Indicador oficial | Cadastro nacional criado |
| Responsável / fonte de dados | Sedec / Sedec |
| Ministério | MIDR |

O objetivo fala em resposta, mas a linha da meta assinala preparação; manter a distinção. O prazo é compromisso do plano fornecido, não situação atual de execução. O indicador oficial não será contabilizado como atingido por este projeto.

## Solução e contribuição delimitada

Protótipo público estático que permite a um operador manter instituições e ofertas, consultar recursos e transferir sua base por arquivo JSON. A versão publicada demonstrará funcionalidades de cadastro relacionadas à meta 3.1.5, com base demonstrativa fictícia e armazenamento individual.

Fluxo: formulário de instituição/oferta → validação e serviços JavaScript → IndexedDB → consulta filtrada/detalhes. Importação/exportação JSON oferece transferência e recuperação explícitas. As regras e campos detalhados serão definidos em G1 e contratos em G2.

Arquitetura acordada: aplicação web HTML/CSS/JavaScript, armazenamento IndexedDB, intercâmbio JSON, automação GitHub Actions e hospedagem GitHub Pages. Sem API HTTP ou servidor de banco remoto. O tema escuro retro neon será definido em spec 11, com legibilidade e movimento reduzido; nenhum efeito visual substitui requisito de funcionamento.

## Incluído

- Instituições e ofertas vinculadas, cadastro, consulta, edição e desativação.
- Filtros de município, categoria e disponibilidade.
- Validação, integridade e persistência no mesmo navegador/origem.
- Importação/exportação JSON, dados fictícios iniciais e restauração demonstrativa confirmada.
- Interface responsiva, teclado, feedback de erro e preferência de movimento reduzido.
- Publicação GitHub/Pages, instruções, testes, apresentação e vídeo até cinco minutos.

## Excluído

- Cadastro nacional oficial, integração com Sedec/S2iD ou cooperação institucional comprovada.
- Base central, sincronização automática entre usuários/dispositivos e autenticação.
- Contato com instituições, envio de mensagens, reservas, logística ou entrega de recursos.
- Dados pessoais/reais, captação financeira e comprovação de doações.
- IA, sensores, mapa e previsão de risco como dependências do protótipo.

## Indicadores e limites

Indicador próprio candidato: tempo para localizar oferta compatível e percentual de acertos, com protocolo futuro em G6. Não há linha de base medida, meta percentual prometida ou benefício comprovado. Tempo técnico de consulta não equivale a tempo humano de busca.

Dados ficam por navegador/origem e podem ser removidos; deploy não sincroniza cadastros. Localhost e Pages não compartilham armazenamento. Exportação/importação é o meio de transferência. Dados de demonstração não provam oferta real nem capacidade operacional.

## Classificação das afirmações

| ID | Tipo | Afirmação | Fonte / verificação |
|---|---|---|---|
| F01 | verified_fact documental | O enunciado exige meta específica, >=3 componentes tecnológicos, protótipo e indicador | H3-AC pp.2–5; checklist G0 |
| F02 | verified_fact documental | Meta 3.1.5 e seus campos oficiais | Quadro 6 PN-PDC pp.114–115; ficha G0 |
| F03 | verified_fact documental | Entrega com 17 itens e vídeo de até cinco minutos | H3-AC p.6 |
| F04 | verified_fact documental | Necessidade real de padronizar fluxo/canal e prioridades de pedidos de doações no RS em 2024 | Orientação 01/2024, considerandos e itens 1–4 |
| D02 | derived | Organizar ofertas institucionais é contribuição parcial ao problema informacional | Ponte explícita entre F04 e a solução, sem confundir pedidos e ofertas |
| H02 | assumption | Filtros podem reduzir esforço de consulta | Protocolo/medição futura G6 |
| D01 | derived | CRUD e consulta demonstram contribuição parcial ao cadastro previsto | Relação entre F02 e funcionalidades; não cumprimento nacional |
| P01 | decisão de projeto | Pages + IndexedDB e dados fictícios individuais | Planejamento acordado com usuário |
| P02 | decisão de projeto | Caso real RS/2024; registros da demonstração fictícios | Escolha explícita do usuário em 09/10/2026 |

verified_fact significa conferido no documento fornecido, não confirmação externa de atualização/execução da política pública.

## Decisões pendentes e momento de resolução

| Questão | Tratamento / gate | Bloqueia G0? |
|---|---|---|
| Nome final / integrante | Nome provisório; integrante a informar antes de G7/G8 | Não |
| Fundamentação do problema real | Caso RS/2024 selecionado, fonte conferida e revisão independente PASS | Não |
| Município específico | Desnecessário: recorte estadual histórico documentado; base do protótipo fictícia | Não |
| Identificação institucional/CNPJ, unidades, duplicidade e estados | Resolver em G1 antes de código | Não |
| Stack de build/teste, schema e migração | Resolver em G2 | Não |
| Formato exato do arquivo único | ZIP como proposta; texto do enunciado ambíguo; confirmar antes do pacote final | Não |
| Individual ou equipe | Enunciado alterna termos; identificação real depende do usuário antes da entrega | Não |
| Participantes de medição | G6 explicita se há pessoas; ausência não autoriza inventar avaliação | Não |
| Permissões GitHub/Pages | Verificar em G9; URL prevista não é publicação | Não |

## Critério de aceite de G0

Enunciado integral mapeado, ficha da meta conferida visualmente, quatro perguntas respondidas com fonte de problema real, distinção entre contexto histórico e dados fictícios, ponte explícita entre problema e solução e limites claros, pendências atribuídas a gates, revisão independente sem erro material. A matriz completa da rubrica permanece em docs/RASTREABILIDADE.md; G0 valida fundamentação, não os resultados futuros.

Referências locais: H3-AC - Arquiteturas Convergentes - Sistematização.pdf e PLANO-NACIONAL-DE-PROTECAO-E-DEFESA-CIVIL.pdf. Integridade e mapa de fontes em evidence/G0/fontes.md.

## Pendências documentais identificadas em G0

A pendência anterior de problema sem fonte foi tratada com a escolha do caso RS/2024 e sua orientação oficial. O diagnóstico de dispersão foi retirado. G0 recebeu PASS na nova revisão independente (evidence/G0/review-rs-2024.md); o parecer anterior permanece como histórico. G1 é a próxima etapa, ainda não iniciada.

Na rubrica, os nove pesos somam 9,0 pontos, enquanto o total impresso é 10,0. Preservar os pesos originais e solicitar esclarecimento antes da entrega; não redistribuir o ponto ausente. O prazo 2027 anteriormente registrado foi corrigido para 2031 após conferência visual.
