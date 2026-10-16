# Roteiro de pitch — Cadastro de Doadores Institucionais

**Duração estimada:** 4min18s, incluindo demonstração de 60s. As falas abaixo contêm 395 termos pela regra JavaScript `/[\p{L}\p{N}]+(?:[.,]\p{N}+)?/gu`, que mantém separadores decimais como em `0,4` dentro de um termo. A estimativa usa 120 palavras por minuto (197,5s de fala + 60s de demonstração, arredondados para cima). Não é resultado de ensaio oral. O vídeo G8 ainda não foi gravado; não há avaliação por participante.

## Slide 1 · Abertura — 0:20

> Este é o Cadastro de Doadores Institucionais, projeto acadêmico de Felipe Paz Santiago. Ele organiza informações de instituições e recursos que declaram oferecer. O protótipo usa dados fictícios e contribui parcialmente para a meta 3.1.5 do Plano Nacional de Proteção e Defesa Civil.

## Slide 2 · Pergunta 1: qual é o problema? — 0:35

> No Rio Grande do Sul, em 2024, uma orientação operacional documentou a necessidade de padronizar o fluxo e o canal de pedidos de doações, definir prioridades e organizar informações sobre local e público atendido. Esse processo afeta equipes que recebem e analisam pedidos, Prefeituras e instituições de assistência humanitária. A fonte trata de pedidos; nosso protótipo representa ofertas institucionais, como contribuição informacional parcial. A fonte não prova que faltava um cadastro nem mede atrasos ou dispersão. Os registros demonstrativos são fictícios.

## Slide 3 · Pergunta 2: qual meta? — 0:25

> A meta selecionada é 3.1.5: “Criar cadastro nacional de doadores institucionais para formar rede para atuar na resposta a desastres.” Ela se relaciona ao Objetivo 3.1: aprimorar capacidades de atuação na resposta a desastres. O eixo é Preparação, o prazo é 2031 e o indicador oficial, “Cadastro nacional criado”. O protótipo não é o cadastro nacional e não declara o indicador atingido.

## Slide 4 · Pergunta 3: como a Computação contribui? — 0:30

> A aplicação recebe instituições e ofertas, valida campos e vínculos, filtra e guarda os dados no IndexedDB do navegador. JSON permite transferir uma cópia explicitamente. HTML, CSS e JavaScript formam a interface; IndexedDB mantém os dados locais; Node.js executa build e verificações. Actions prepara hospedagem estática futura no Pages, que não sincroniza bancos entre pessoas.

## Slide 5 · Pergunta 4: como funciona? — 0:20

> O caminho é informar instituição e oferta, validar, gravar e consultar por recurso e localidade. Vou mostrar consulta, formulário responsivo e backup. A disponibilidade é declarada; unidades diferentes não são somadas.

## Demonstração planejada — 1:00

| Tempo | Ação planejada |
|---|---|
| 0:00–0:15 | Abrir Ofertas e localizar os filtros; mostrar os resultados fictícios. |
| 0:15–0:30 | Aplicar filtros combinados, por exemplo recurso e município; indicar que a lista muda. |
| 0:30–0:42 | Abrir Instituições/Formulário e apontar campos e validação, sem inserir dados reais. |
| 0:42–0:52 | Abrir a área de backup e indicar exportação JSON; não substituir a base sem necessidade. |
| 0:52–1:00 | Retomar os slides e lembrar que persistência é local e transferência é explícita. |

Esta sequência é um plano de demonstração. A sequência técnica automatizada do coordenador verifica navegação/operações de interface e sua duração, mas não conta como fala, ensaio humano ou avaliação de usabilidade.

## Slide 7 · Pergunta 5: como medir? — 0:35

> O indicador próprio principal é a proporção de consultas com conjunto de IDs exatamente igual ao gabarito. Em G6, houve 480 acertos em 480 consultas e oito tarefas sintéticas. A mediana foi 0,4 milissegundo tanto na listagem de referência quanto no sistema filtrado; a redução agregada foi zero por cento. O ensaio usou Chromium headless, base fictícia e nenhum participante humano. Mede consulta computacional, não busca feita por uma pessoa.

## Slide 8 · Benefício e limite — 0:20

> Esperamos que uma consulta organizada reduza o esforço para localizar ofertas, mas isso é hipótese. Os dados ficam por navegador e origem, sem sincronização; o backup precisa ser transferido. Avaliar o benefício humano exige pessoas e bases adequadas. O protótipo de ofertas não substitui pedidos, coordenação oficial ou cadastro nacional.

**Total estimado:** 4min18s (258 segundos: 395 termos conforme `/[\p{L}\p{N}]+(?:[.,]\p{N}+)?/gu`, divididos por 120 termos/minuto, mais 60s de demonstração, arredondados para cima). A fala não foi ensaiada por uma pessoa; G8 exige gravação real com áudio e duração de até cinco minutos.
