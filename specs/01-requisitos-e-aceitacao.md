# 01 — Requisitos e aceitação

Estado: G1 PASS documental após revisão independente (evidence/G1/review.md). Base: spec 00 aprovada, caso RS/2024. Esta spec descreve comportamento futuro; nenhum teste de produto executado.

## Ator e cenários

Um operador usa uma base individual no navegador, sem login. Instituições doadoras são registros, não usuários autenticados. Fluxo principal: cadastrar instituição → cadastrar suas ofertas → consultar por município/categoria/disponibilidade → editar → desativar. Pedidos, priorização, mobilização e entrega permanecem fora do escopo. Todos os contatos e registros demonstrativos são fictícios.

Prioridades: P1 obrigatório para entrega; P2 melhoria opcional (nenhuma necessária para fechar os requisitos abaixo). IDs T indicam cenários de teste previstos, não testes existentes. Regras de valores/estados na spec 02 são normativas.

| ID / prioridade | Entrada / ação | Saída observável | Erro / resultado negativo | Aceitação prevista |
|---|---|---|---|---|
| RF01 P1 | Instituição válida, salvar | Registro com ID estável e timestamps; detalhe e lista exibem valores | Campo inválido ou identidade duplicada: mensagem no campo, nada salvo | T01 válido persiste após recarga; T02 nome vazio, UF inválida e duplicata não alteram base |
| RF02 P1 | Oferta válida para instituição ativa | Oferta vinculada aparece no detalhe da instituição e na consulta | Instituição ausente/inativa ou quantidade inválida: rejeitar sem gravação | T03 duas ofertas na mesma instituição; T04 vínculo inválido, quantidade negativa e unidade incompatível |
| RF03 P1 | Abrir detalhe/lista | Instituições e ofertas com estado, recurso, quantidade/unidade, local e atualização | ID inexistente: registro não encontrado; base vazia: orientação para cadastrar | T05 detalhe consistente e ID desconhecido; T06 listas vazias sem erro |
| RF04 P1 | Editar instituição/oferta | ID/createdAt preservados; updatedAt atualizado; filtros refletem novo dado | Mesmas validações da criação; tentativa inválida preserva dados anteriores | T07 editar município e recurso; T08 duplicidade e campo inválido mantêm original |
| RF05 P1 | Confirmar desativação de instituição/oferta | Estado inativo, dados preservados; ofertas deixam de ser compatíveis | Cancelar não altera nada; inexistente gera não encontrado | T09 desativar instituição com duas ofertas; T10 cancelar e desativar oferta isolada |
| RF06 P1 | Confirmar reativação | Instituição/oferta ativa; disponibilidade efetiva recalculada | Oferta só pode reativar com instituição ativa e dados válidos | T11 reativar instituição não reativa ofertas; T12 reativar oferta sob instituição inativa é rejeitado |
| RF07 P1 | Município, UF, categoria, disponibilidade, texto; limpar filtros | Interseção dos filtros e ordenação determinística; contagem de ofertas | Filtro inválido não executa busca; sem correspondência exibe zero e permite limpar | T13 busca simples e combinada; T14 sem resultado, acentos e limpar |
| RF08 P1 | Exportar base | Arquivo JSON com versão, instituições/ofertas e vínculos; sem mudar base | Falha de geração/download explicada, dados preservados | T15 exportar base vazia e preenchida; T16 erro sem perda |
| RF09 P1 | Selecionar JSON e confirmar substituição | Validar integralmente; substituir base da aplicação de forma atômica; preservar IDs/timestamps válidos | Versão inválida, vínculos/duplicatas/campos inválidos rejeitam arquivo inteiro; cancelar preserva base | T17 ida/volta exportar-importar; T18 arquivo inválido e falha de gravação sem alteração parcial |
| RF10 P1 | Primeira abertura ou restaurar demonstração | Seed fictício uma vez; restauração exige confirmação e substitui somente base da aplicação | Cancelar não altera; falha mantém base anterior | T19 recarga/deploy não sobrescrevem edições; T20 restaurar/cancelar |
| RN01 P1 | Recarregar/reabrir mesma origem/perfil | Registros preservados enquanto armazenamento existir | IndexedDB indisponível/quota/falha: informar impedimento; não alegar salvamento nem usar fallback volátil silencioso | T21 recarga/reabertura; T22 armazenamento negado/falha |
| RN02 P1 | Visitar site público / outro perfil | Avisos visíveis: demo acadêmica, dados fictícios e locais; bases independentes | Sem promessa de compartilhamento ou autenticação | T23 outro perfil/origem e aviso de exportação |
| RN03 P1 | Teclado, celular, preferência de movimento reduzido | Rótulos, foco visível, erros associados; confirmação acessível; layout e tema legíveis | Erro anunciado sem depender apenas de cor; animações respeitam preferência | T24 teclado/360–1440px/zoom200%; T25 movimento reduzido; critérios visuais detalhados em G2/GV |
| RN04 P1 | Inserir texto semelhante a HTML | Texto exibido literalmente sem executar código | Nenhuma interpretação de conteúdo importado como HTML | T26 nome/recurso com marcação em formulário e JSON |

## Busca de oferta compatível

Compatível significa instituição ativa, oferta ativa, disponibilidade declarada disponível e quantidade > 0, além dos filtros informados. Não representa estoque confirmado ou doação reservada. Consulta padrão mostra apenas compatíveis; operador pode escolher todas, indisponíveis ou inativas para manutenção. Regra detalhada e exemplos: spec 02.

## Integridade e limites

Sem exclusão física individual; desativação reversível. Importação e restauração são substituições destrutivas da base local, com aviso e confirmação específicos e recomendação de exportação prévia. Não há mescla automática; isso evita resolução ambígua de conflitos. G2 detalhará formato versionado, assinaturas assíncronas, transações e limite de arquivo.

Não somar quantidades de ofertas ou converter unidades. Uma consulta retorna ofertas, não número de instituições únicas. Não há requisito de cadastro de beneficiários, upload de documentos, CNPJ verificado, mensagens ou informação pessoal real.

## Riscos e cobertura

| Risco | Tratamento / verificação futura |
|---|---|
| Limpeza do navegador, quota, perfis/origens diferentes | Aviso e exportação; RN01/RN02; T21–23 |
| Oferta desatualizada confundida com estoque real | Mostrar updatedAt e aviso de disponibilidade declarada; RF03/RF07 |
| Importação/seed sobrescrevendo trabalho | Validação integral, confirmação, atomicidade, seed inicial único; RF09/RF10 |
| Uso público sem autenticação | Apenas demo fictícia; nenhuma base compartilhada ou dado real; RN02 |
| Efeito visual prejudicar trabalho | RN03 e revisão GV; sem promessa de acessibilidade validada antes da execução |
| Generalizar caso histórico ou benefício | Fonte G0 e limites preservados; G6 mede hipótese, sem antecipar resultado |

G1 fecha especificação e cobertura planejada. Implementação e execução T01–T26 pertencem aos gates de produto; PASS documental não é teste funcional aprovado.
