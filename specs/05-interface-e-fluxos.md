# 05 — Interface e fluxos

Versão 1, proposta G2. UI futura conforme serviços spec 04 e tokens spec 11. Preview em design/preview é artefato estático, sem dados persistidos ou confirmação funcional de produto.

## Estrutura e navegação

Cabeçalho “Cadastro de Doadores Institucionais”, aviso persistente “Demonstração acadêmica • dados fictícios • salvos somente neste navegador. Exporte para guardar uma cópia.”, navegação Ofertas / Instituições / Dados e área main com título único por tela. Link pular para conteúdo, links com aria-current, título de documento e foco no título ao trocar rota. Não usar linguajar de jogo nos comandos.

| Hash | Tela / operações |
|---|---|
| `#/ofertas` (padrão) | Consulta compatível por padrão; consultarOfertas; filtros e contagem de ofertas |
| `#/instituicoes` | listarInstituicoes; busca nome/estado; criar instituição; acesso ao detalhe |
| `#/instituicoes/nova` | criarInstituicao |
| `#/instituicoes/:id` | obterInstituicao + ofertas do snapshot por vínculo; detalhe e ações |
| `#/instituicoes/:id/editar` | editarInstituicao com timestamp lido |
| `#/instituicoes/:id/ofertas/nova` | criarOferta, vínculo fixo exibido |
| `#/ofertas/:id` | obterOferta, detalhe, editar/desativar/reativar |
| `#/ofertas/:id/editar` | editarOferta com vínculo fixo e timestamp lido |
| `#/dados` | exportarBase, validarImportacao/importarBase e restaurarDemonstracao |

Hash desconhecido ou ID inválido mostra “Página/registro não encontrado” e retorno seguro. Links internos preservam o caminho base. Back/forward funciona sem reescrita no servidor. Filtros ficam na memória da tela enquanto navega para detalhe e volta; recarga assume padrão explícito. Alteração não salva exige diálogo de descartar/continuar editando ao navegar internamente; aviso beforeunload apenas quando suportado, sem promessa de recuperar rascunho após fechar navegador.

## Consulta e detalhe

Filtros com rótulos permanentes: Texto (nome ou recurso, máx.120), Município (máx.80), UF (27 siglas e Todas), Categoria (oito enums spec 02 e Todas), Situação (Compatíveis, Indisponíveis, Inativas, Todas). Aplicar chama consultarOfertas; Limpar restaura compativeis e campos vazios. Exibir contagem de **ofertas**, não instituições distintas nem soma de quantidades. Cartão/linha: recurso, categoria, quantidade/unidade, disponibilidade declarada, estado, nome da instituição, município/UF, updatedAt e link Ver oferta. Comparação/ordenação do serviço não depende do texto traduzido da UI.

Detalhe de instituição exibe todos campos, código fictício, estado e datas; ofertas vinculadas incluem inativas, identificadas. Ação Nova oferta indisponível se instituição inativa, com razão textual e acesso a reativação. Detalhe de oferta exibe todos campos e instituição/local atuais; disponibilidade efetiva explicada por texto “Compatível”, “Indisponível” ou “Inativa”. Quantidade declarada não é estoque confirmado. Não mostrar botões de reserva, entrega, contato automático ou exclusão física.

## Formulários

Instituição: nome* 2–120, tipo* select, identificação fictícia* 2–40 (sem campo CNPJ), UF* select, município* 2–80, contato fictício opcional 120, observações 500. Estado e datas somente leitura em edição. Oferta: instituição fixa* (nome/código), categoria* select, recurso* 2–120, quantidade* input number min0 max1000000 step1, unidade* select limitado pela categoria, disponibilidade* select e observações 500. Mudança de categoria que invalida unidade requer nova seleção, sem escolha silenciosa. “Disponível” exige quantidade >=1. Vínculo não pode ser editado.

Rótulos associados a input; obrigatório em texto e `required`; ajuda via aria-describedby; validação HTML é conveniência, serviço sempre valida. Antes de salvar, normalizar no serviço; quantidade convertida explicitamente na UI, vazio não vira zero. Durante await, ação de envio desabilitada, formulário aria-busy e texto “Salvando…”. Resposta de sucesso apenas após commit: anúncio role=status e navegação ao detalhe. Erro mantém campos, resumo com role=alert e links aos campos, aria-invalid, mensagem específica. Falha global de storage oferece tentar novamente sem apagar entrada; conflito mostra informação de registro alterado e opção de recarregar após aviso.

## Estados comuns

| Estado | Consulta | Formulário |
|---|---|---|
| Carregamento | “Consultando ofertas…” em role=status; marcar região ocupada | “Carregando registro…”; envio bloqueado até ler |
| Normal | Filtros, contagem e itens | Campos, ajuda, salvar e cancelar |
| Vazio | “Nenhuma oferta encontrada”; limpar filtros; se base vazia, cadastrar instituição | Criação vazia com rótulos, exemplos fictícios e campos obrigatórios |
| Erro | Filtro inválido junto ao campo; resultado anterior explicitamente marcado; falha de leitura global | Preservar entrada, resumo/erros e tentar novamente |
| Sucesso | Contagem atualizada anunciada sem mover foco em toda busca | “Instituição/oferta salva neste navegador” após commit |

Inicialização falhou: aviso persistente, impedir cadastro/import/restauração e não fingir base vazia. Armazenamento indisponível não troca para base só em memória. Exportar só se leitura íntegra possível. Números de resumo da aplicação derivam da base atual; preview identifica todos como exemplos.

## Confirmações e intercâmbio

Desativar instituição: “Desativar [nome]? Todas as ofertas desta instituição ficarão inativas. Quantidades e disponibilidades serão preservadas.” Botões Cancelar e Desativar. Reativar: “As ofertas continuarão inativas; reative-as individualmente.” Oferta: explicar estado e preservação de valores. UI envia confirmacao true e expectedUpdatedAt apenas ao aceitar.

Dados: Exportar gera download `cadastro-doadores-AAAA-MM-DD.json`; não afirmar cópia salva se download falhar. Importar aceita arquivo JSON até 2 MiB, lê como UTF-8, valida integralmente e mostra contadores e aviso “Substituir toda a base deste aplicativo neste navegador? Exporte antes se deseja conservar os dados atuais. Não haverá mescla.” Cancelar não chama mutação. Confirmar usa texto já validado e revisão da base obtida ao abrir diálogo; serviço revalida. Restauração demonstração usa o mesmo aviso e diálogo próprio com efeito explícito, não um reset automático. Depois do commit, atualizar resumos e listas; arquivo inválido não altera base.

Diálogos nativos `<dialog>` ou equivalente acessível com nome/descrição, foco inicial em Cancelar, contenção de Tab, Escape cancela, retorno ao botão de origem; enquanto commit não conclui não permitir confirmar duas vezes. Erro mantém diálogo informado, não mostra sucesso. Teclado alcança toda ação; nenhum significado depende apenas da cor. Mobile/zoom/contraste e movimento conforme spec 11; verificação prevista spec 06.

Formulários/detalhes obtêm entidade e revisão em obterBase no mesmo snapshot e enviam expectedRevision junto expectedUpdatedAt em editar/mudar estado. Se outra mutação ocorrer, CONFLICT exige recarregar/revisar; não reenviar automaticamente com token novo.
