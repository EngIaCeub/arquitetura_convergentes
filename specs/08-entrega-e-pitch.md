# 08 — Entrega acadêmica e pitch

Estado: materiais G7 preparados; aguardam ensaio técnico e revisão independente. Formato dos materiais G7: apresentação HTML navegável com pasta de assets locais, roteiro e instruções. Isso organiza os materiais da etapa e ainda não constitui o pacote único final. Para G8, a escolha operacional conservadora será um único ZIP com materiais, código e vídeo real, diante da ambiguidade da expressão “um único arquivo (zip - PPT, PDF, HTML, vídeo)”. G7 não fecha os requisitos de pacote nem de vídeo do G8.

## Artefatos

- [Apresentação HTML](../output/G7/index.html): oito seções, navegação por teclado e botões, adapta-se à leitura vertical em telas estreitas.
- [Roteiro de pitch](../output/G7/roteiro.md): falas das cinco perguntas e demonstração planejada, duração estimada menor que cinco minutos. Não há ensaio oral ou vídeo gravado.
- [Instruções de abertura e demonstração](../output/G7/instrucoes.md).
- Capturas reais locais: `output/G7/assets/app-1440.png`, `form-360.png` e `backup.png`, copiadas de `evidence/GV/` e `evidence/G4/`; os originais foram preservados.

O HTML embute CSS, SVG do diagrama e JavaScript de navegação; as três capturas são assets relativos locais. A seção Protótipo abre cada captura original ao selecioná-la. O diagrama separa banco IndexedDB local de arquivos estáticos para hospedagem futura em GitHub Pages.

Contagem do roteiro: 395 termos de fala pela regex JavaScript `/[\p{L}\p{N}]+(?:[.,]\p{N}+)?/gu`, que mantém `0,4` em um termo; a estimativa é `(395 ÷ 120 × 60) + 60 = 257,5 segundos`, arredondados para cerca de 4min18s. Essa é uma estimativa de duração, não ensaio falado.

## Rastreabilidade dos 17 itens

| ID | Conteúdo exigido | Onde aparece | Fonte ou evidência |
|---|---|---|---|
| A01 | Nome do projeto | slides 1 e título HTML | Cadastro de Doadores Institucionais (marca visual REDE) |
| A02 | Integrante | slide 1 | Felipe Paz Santiago, identificação fornecida pelo usuário |
| A03 | Problema | slide 2; roteiro, pergunta 1 | spec 00; Orientação Operacional nº 01/2024, considerandos e itens 1, 3, 4(a), 6 |
| A04 | Público afetado | slide 2; roteiro, pergunta 1 | Equipes que recebem/analisam pedidos, Prefeituras e instituições de assistência; operador do protótipo distinguido do público do caso |
| A05 | Meta PN-PDC | slide 3; roteiro, pergunta 2 | PN-PDC, Quadro 6, página digital 58, impressa 114; meta 3.1.5 literal |
| A06 | Objetivo relacionado | slide 3 | Objetivo 3.1 literal; ficha G0 |
| A07 | Eixo | slide 3 | Preparação; marca Pp na linha da meta, legenda do Quadro 6 |
| A08 | Prazo | slide 3 | Coluna 2031; ficha G0 |
| A09 | Indicador oficial | slides 3 e 8 | “Cadastro nacional criado”; Sedec é responsável e fonte de dados; protótipo não declara indicador atingido |
| A10 | Solução proposta | slides 1 e 4 | spec 00/01; manter instituições/ofertas fictícias, consultar filtros e transferir JSON |
| A11 | Entrada, processamento e saída | slide 4; roteiro, pergunta 4 | Instituição/oferta → serviços, validação e filtros → IndexedDB/consulta e JSON |
| A12 | Arquitetura | slide 5; roteiro, pergunta 3 | spec 03; diagrama SVG embutido, banco local e hospedagem estática distinguidos |
| A13 | Tecnologias | slide 5 | HTML/CSS/JavaScript, IndexedDB, JSON, Node.js, GitHub Actions e GitHub Pages com funções indicadas |
| A14 | Protótipo | slide 6; demonstração planejada no roteiro | Capturas de aplicação, formulário móvel e backup; evidências GV/G4 |
| A15 | Indicador próprio da solução | slide 7; roteiro, pergunta 5 | Acerto exato dos IDs; resultado G6 e limite técnico em specs 07/evidence G6 |
| A16 | Benefício esperado | slides 7 e 8 | Reduzir esforço de consulta é hipótese, não efeito medido |
| A17 | Limitação ou risco | slides 2, 7 e 8 | Distinção pedidos/ofertas; armazenamento por navegador/origem sem sincronização; limites operacionais e ausência de avaliação humana |

## Cinco perguntas obrigatórias do pitch

| Pergunta | Resposta/artefato |
|---|---|
| P1 — Qual é o problema? | slide 2 e roteiro: necessidade documentada de padronizar o fluxo de pedidos no RS/2024, sem alegar cadastro ausente, atraso medido ou dispersão comprovada. |
| P2 — Qual meta do PN-PDC está sendo trabalhada? | slide 3 e roteiro: meta 3.1.5; objetivo 3.1, eixo Preparação, prazo 2031 e indicador oficial. |
| P3 — Como a Computação contribui? | slide 5 e roteiro: validação, persistência local, filtros e intercâmbio explícito JSON organizam informação de ofertas; é contribuição parcial. |
| P4 — Como a solução funciona? | slides 4 e 6 e roteiro: entrada, regras, IndexedDB, consulta, backup e demonstração da interface. |
| P5 — Como será medido o resultado? | slide 7 e roteiro: acerto exato e duração técnica; G6 teve 480/480 acertos, medianas iguais de 0,4 ms e redução agregada de 0%; zero participantes humanos. |

## Limites da entrega e pendências

A Orientação Operacional nº 01/2024 regula pedidos; o protótipo registra somente ofertas e fornece contribuição informacional parcial. URL pública do caso: https://www.gov.br/reconstrucaors/pt-br/central-de-conteudo/documentos/orientacao-operacional-no-01-2024. O PN-PDC foi conferido na fonte local pelo registro G0; a apresentação fornece localizador de páginas, sem inventar link público para o plano. Não há URL de deploy, vídeo ou ensaio humano.

G6 mede somente consultas sintéticas em base fictícia, com 8 tarefas e 30 repetições por tarefa/método em Chromium headless. Mediana geral 0,4 ms em ambos os métodos; redução técnica agregada 0%. A medição não estima tempo humano nem benefício. A faixa em volume máximo tem pausas técnicas observadas, registradas em evidence/G5; não há perda ou erro observado nesses cenários.

O enunciado registra nove pesos cuja soma é 9,0 e total impresso de 10,0. Os pesos foram preservados; a diferença requer esclarecimento da disciplina. O pacote final único será montado como ZIP em G8, reunindo estes materiais, o código e um vídeo real com áudio de até cinco minutos. O vídeo ainda não foi gravado; G7 não fecha G8. G7 aguarda revisão independente e ensaio técnico de navegação; G8 também exige revisão do vídeo, extração limpa e verificação final do pacote. Não registrar PASS ou publicação nesta especificação.
