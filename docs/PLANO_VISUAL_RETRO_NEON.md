# Etapa visual — Tema escuro retro neon

Estado: design e estilos pendentes; três skills locais criadas e validadas estruturalmente. Inventário em [SKILLS_DO_PROJETO.md](SKILLS_DO_PROJETO.md).

## Direção visual

Criar uma central de recursos com atmosfera de terminal espacial/arcade: fundo azul quase preto, painéis escuros, contornos técnicos, ciano e magenta como acentos, violeta em superfícies secundárias e âmbar para chamar atenção. Inspiração em HUDs de exploração espacial, incluindo a referência verbal a Metroid, com identidade própria do cadastro.

As cinco imagens fornecidas são referências visuais, não instruções de produto nem assets automaticamente destinados à publicação.

| Referência | Características aproveitadas | Aplicação na interface |
|---|---|---|
| 1 — Nintendo 64 e cartuchos | Violeta/azul, magenta intenso, recortes e iluminação quente | Bordas, ação principal e detalhes geométricos |
| 2 — Arcades noturnos | Fundo muito escuro, luz ciano, magenta e painéis luminosos | Referência dominante de contraste e atmosfera |
| 3 — PlayStation | Superfícies violetas, contornos quentes e controles físicos | Estados pressionados, botões e agrupamento dos controles |
| 4 — Corredor de arcades | Profundidade, módulos e reflexos localizados | Hierarquia entre navegação, resumo e área de trabalho |
| 5 — GameCube lavanda | Formas mais suaves e composição simples | Violeta secundário e detalhes discretos nos estados vazios |

Não reproduzir a saturação de uma ilustração sobre formulários inteiros. O fundo escuro e a iluminação da referência 2 orientam o conjunto; as demais enriquecem detalhes. Metroid orienta a atmosfera/HUD, sem mudar textos do cadastro para comandos de jogo. Manter nomes como Instituições, Ofertas, Cadastrar, Editar e Exportar.

## Tokens candidatos para spec 11

| Token | Valor inicial | Uso |
|---|---|---|
| background | #080B16 | Fundo principal |
| surface | #12182B | Painéis e formulários |
| surface-raised | #1B2340 | Áreas elevadas |
| text-primary | #F1F5FF | Texto principal |
| text-secondary | #B8C4DF | Texto auxiliar |
| accent-cyan | #53E8FF | Foco e interação |
| accent-magenta | #FF4FA3 | Destaques pontuais |
| accent-violet | #A58BFA | Elementos secundários |
| warning | #FFD166 | Atenção |
| success | #6EE7B7 | Disponível/sucesso |
| danger | #FF718A | Erro/desativação |

São candidatos, não pares de contraste já validados. Medir as combinações efetivamente usadas. Meta de aceite: contraste de texto normal >= 4,5:1; texto grande >= 3:1; limites essenciais de controles e foco >= 3:1 em relação ao entorno. Separar cor decorativa de cor semântica; estados possuem texto/ícone além da cor.

Tipografia: corpo com fonte de sistema legível; monospace para metadados e pequenos títulos técnicos. Fonte pixel opcional só em marca/título curto, nunca em campos, tabelas ou parágrafos. Evitar carregar fontes externas para a demonstração funcionar sem dependência de CDN.

## Componentes e comportamento

- Cabeçalho com identidade do projeto e aviso de demonstração/dados no navegador.
- Navegação lateral no desktop e adaptação compacta no celular.
- Resumo de instituições/ofertas derivado dos dados reais do navegador, sem números fictícios decorativos.
- Área de filtros com resultado e ações explícitas; cartões/tabela sem sacrificar densidade útil.
- Formulários com rótulos permanentes, mensagens associadas e foco evidente.
- Botões com borda/luz suave no hover e estado pressionado; destrutivos claramente distintos.
- Diálogos de confirmação com foco gerido, Escape e retorno ao controle de origem.
- Estados vazio, erro, carregamento e sucesso com o mesmo sistema visual; avisos persistentes não desaparecem antes de poderem ser lidos.
- Geometrias de HUD em CSS/SVG, decorativas e sem bloquear eventos; scanline estática sutil apenas no fundo, opcional e removível se prejudicar leitura.

## Movimento de baixo custo

Transições candidatas: 120–180 ms para controles; 180–240 ms para painéis/diálogos. Preferir opacity e transform, deslocamento pequeno e sem retardar ações. Não usar transition: all.

Respeitar prefers-reduced-motion: reduzir/remover animações e deslocamentos, mantendo feedback estático. Sem piscadas, glitch, paralaxe, partículas contínuas, fundo em vídeo, áudio automático ou animação permanente de sombras. Glow estático discreto, concentrado em ações e bordas; sem blur sobre toda a tela. Não adicionar engine de jogo ou WebGL para obter o tema.

## Skills locais criadas

| Skill | Responsável | Entrada e procedimento | Saída / aceite |
|---|---|---|---|
| definir-identidade-retro-neon | Perfil designer temporário do especificador, Sol/medium | Interpretar referências; definir hierarquia, tokens, componentes, estados e movimento; conferir coerência com os fluxos | spec 11, mapa de referências e preview estático original; contraste e regras documentados |
| aplicar-tema-e-movimento | Implementador, Sol/medium | Aplicar tokens e componentes; implementar estados/transições; respeitar movimento reduzido; manter semântica e regras do domínio | CSS/componentes e testes dos fluxos afetados; screenshots desktop/mobile e redução de movimento |

Reutilizar validar-gate: verificador Luna/high reproduz fluxos e capturas; revisor Sol/high analisa apenas falhas de foco, movimento, integridade ou regressões relevantes. Não criar agente visual permanente. skill-creator foi usada para criar e validar as três skills locais de identidade, aplicação do tema e validação. Gates visuais continuam pendentes.

Priorizar CSS/SVG originais. Imagegen só entra se a implementação precisar de uma ilustração bitmap específica; não é requisito do tema e não será acionada só para planejar. As imagens anexadas permanecem referências privadas; não copiar marcas, personagens ou papéis de parede para o bundle por padrão.

## Posição na execução

Nova etapa **GV — Identidade visual e estilização**, entre G4 e G5. Ordem: P0 → G0 → G1 → G2 → G3 → G4 → GV → G5 → G6 → G7 → G8 → G9.

Em G2, antecipar GV.1–GV.3 como subtarefas de design: G2.7 depende da spec 11 e do preview revisados. Após G4, executar GV.4–GV.10 e fechar GV. Assim o visual orienta a construção sem exigir um gate futuro já concluído. G5 inicia somente com G4 e GV PASS. Gates anteriores não são aprovados novamente sem alteração que justifique revisão.

## Tarefas e metas verificáveis

| ID | Task | Skill / perfil | Dependência | Entregável e aceitação |
|---|---|---|---|---|
| GV.1 | Consolidar referências e hierarquia da página | definir-identidade-retro-neon / designer | G1 PASS, G2.4 | Mapa visual com características das cinco imagens e telas do sistema; preservar referências no projeto somente em diretório de design excluído do bundle se necessário |
| GV.2 | Definir tokens, componentes e movimento | definir-identidade-retro-neon / designer | GV.1 | specs/11-design-retro-neon.md: cores, contraste, tipografia, espaçamento, responsividade, estados e reduced motion |
| GV.3 | Criar e revisar preview de consulta e formulário | definir-identidade-retro-neon + validar-gate / designer/verificador | GV.2 | Preview HTML/CSS desktop/mobile; hierarquia legível, sem overflow; critérios da spec 11 conferidos para G2.7 |
| GV.4 | Implementar tema base e estrutura responsiva | aplicar-tema-e-movimento / implementador | G4 PASS, GV.3 | Tokens centralizados; cabeçalho/navegação/painéis e aviso de dados locais funcionando |
| GV.5 | Estilizar formulários, filtros, ofertas e ações | aplicar-tema-e-movimento / implementador | GV.4 | Fluxos do cadastro íntegros; todos os estados aplicados; números de resumo calculados da base |
| GV.6 | Aplicar transições e preferências de movimento | aplicar-tema-e-movimento / implementador | GV.5 | Hover/foco/pressionado/painéis consistentes; reduced motion verificado; nenhuma animação decorativa contínua |
| GV.7 | Conferir contraste, teclado, foco e zoom | validar-gate / verificador | GV.6 | Pares reais de contraste medidos; zoom 200% sem perda de ação; diálogo devolve foco; mensagens acessíveis |
| GV.8 | Conferir telas, estados e regressões | validar-gate / verificador | GV.7 | Capturas em 360/768/1440 px, busca vazia, erro, cadastro e diálogo; fluxos G3/G4 relevantes continuam funcionando |
| GV.9 | Medir custo visual e corrigir problemas | validar-gate + aplicar-tema-e-movimento / verificador/implementador | GV.8 | Comparação no mesmo navegador/base com tema/efeitos reduzidos; sem bloqueio perceptível de interação; assets/build registrados e sem dependência de backend |
| GV.10 | Revisar resultado e fechar etapa visual | validar-gate / coordenador, revisor se necessário | GV.9 | evidence/GV/review.md, limitações e STATUS PASS; sem falha relevante de uso ou leitura; G5 liberado |

GV.9 não promete um FPS sem hardware/método definidos. Se houver regressão mensurável ou custo alto, simplificar efeitos antes de trocar a stack.

## Integração com entrega e publicação

- P0 passa a criar nove skills locais (sete anteriores + duas visuais).
- Spec 11 integra os contratos; não substitui as regras de dados ou os testes de negócio.
- G5 amplia os checks já desenhados em GV, sem duplicar capturas se nada mudou.
- G6 mede a versão estilizada final, incluindo as transições utilizadas na demonstração.
- G7 usa capturas reais e cores coerentes na apresentação; G8 grava a versão estilizada.
- G9 confirma tema, fonts/assets, reduced motion e navegação na URL Pages; nenhum caminho absoluto local pode entrar no site.
- Nenhum asset temporário anexado é requisito de runtime; eventual referência local preservada fica fora do artefato publicado.

Total revisado: 76 tarefas, sendo 59 no backlog principal, 10 nesta etapa e sete em G9. Nove skills locais planejadas. As nove já possuem SKILL.md no projeto e passaram pela validação estrutural. A descoberta automática depende da atualização do catálogo do ambiente.
