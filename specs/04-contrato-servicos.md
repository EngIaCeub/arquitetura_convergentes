# 04 — Contrato de serviços, armazenamento e JSON

Versão 1. Proposta G2 para revisão; nenhum serviço implementado. Normativo com spec 02; operações são funções JavaScript assíncronas, sem rotas HTTP.

## Tipos e convenções

`Instituicao` e `Oferta` usam exatamente os nomes, tipos, enums, limites e normalizações da spec 02, incluindo `createdAt`/`updatedAt`. UUID aceita representação canônica lowercase de UUID RFC 4122 com versão 1–5 e variante válida; novos IDs usam `crypto.randomUUID()` (v4). Datas são strings exatamente iguais a `new Date(valor).toISOString()` e válidas; `updatedAt >= createdAt`. Não aceitar datas inválidas que o parser normalize silenciosamente. Timestamps novos usam relógio lógico `max(Date.now(), maiorUpdatedAtAnterior+1ms)`; uma mutação/cascata utiliza um único instante. No-op mantém datas e revisão. Se a importação introduzir data futura, próximo instante lógico ainda deve superar os timestamps afetados, sem alterar os importados.

Tipos `CriarInstituicao = {nome,tipo,identificacao,uf,municipio,contato?,observacoes?}` e `CriarOferta = {instituicaoId,categoria,recurso,quantidade,unidade,disponibilidade,observacoes?}`. Criação define `estado:'ativa'`, ID e datas; não aceita esses campos fornecidos pelo chamador. Editar recebe objeto completo dos campos editáveis, não patch: instituição com os mesmos campos de CriarInstituicao; oferta com os de CriarOferta exceto instituicaoId. Não editar id, vínculo, estado nem timestamps. Rejeitar propriedades desconhecidas em comandos e JSON; campos opcionais ausentes normalizam para `''`. Campos não podem ter tipo implicitamente convertido. UI converte quantidade de input para número inteiro antes de chamar serviço; importação nunca converte string em número.

Leituras retornam cópias desacopladas; alterar o retorno não muda a base. Mutação resolve somente depois de commit IndexedDB. Um erro rejeita com `AppError {code,message,fields?}`; `fields` é mapa de nome de campo → mensagem em português. Nunca retornar sucesso antes de `transaction.complete` nem mostrar stack técnica ao operador.

## Serviços públicos

Todos retornam Promise. `base.revisao` é inteiro >=1 obtido em `obterBase`; não é parte do JSON exportado.

| Assinatura | Resultado / regra |
|---|---|
| `inicializar()` | `{revisao,inicializada:true}`; abrir/migrar, seed único se ausente; idempotente |
| `obterBase()` | `{revisao,instituicoes,ofertas}` de um único snapshot consistente; uso na administração/backup |
| `listarInstituicoes({texto='',estado='todas'}={})` | `Instituicao[]`; texto substring de nome normalizado, estado ativa/inativa/todas; ordenação chave nome e UUID |
| `obterInstituicao(id)` | `Instituicao`; ausente NOT_FOUND |
| `criarInstituicao(dados)` | Instituicao criada ativa; valida campos, identidade única e limite |
| `editarInstituicao(id,dados,{expectedUpdatedAt,expectedRevision})` | Instituicao atualizada; preserva ID/createdAt/estado; exige token igual ao timestamp atual, senão CONFLICT |
| `definirEstadoInstituicao(id,estado,{confirmacao:true,expectedUpdatedAt,expectedRevision})` | Instituicao; estado ativa/inativa, confirmação obrigatória; desativar inativa todas ofertas atomicamente; reativar mantém ofertas inativas |
| `obterOferta(id)` | `{oferta:Oferta,instituicao:Instituicao,compativel:boolean}`; ausente NOT_FOUND |
| `consultarOfertas(filtros={})` | `{itens:[{oferta,instituicao,compativel}],total}`; total de ofertas; ordenação spec 02 |
| `criarOferta(dados)` | Oferta ativa; instituição existente/ativa e combinação única |
| `editarOferta(id,dados,{expectedUpdatedAt,expectedRevision})` | Oferta; instituição ativa; preserva vínculo/ID/createdAt/estado; valida quantidade/disponibilidade juntas |
| `definirEstadoOferta(id,estado,{confirmacao:true,expectedUpdatedAt,expectedRevision})` | Oferta; reativar exige instituição ativa; preserva quantidade/disponibilidade |
| `exportarBase()` | string JSON UTF-8 formatada, schema abaixo; leitura consistente; UI cria Blob e download; base não muda |
| `validarImportacao(texto)` | `{schemaVersion:1,totalInstituicoes,totalOfertas}`; valida integralmente sem gravar; limite em bytes; UI conserva texto para confirmação |
| `importarBase(texto,{confirmacao:true,expectedRevision})` | `{revisao,totalInstituicoes,totalOfertas}` após substituir snapshot; revalida integralmente texto e revisão dentro da mutação; preserva IDs/datas |
| `restaurarDemonstracao({confirmacao:true,expectedRevision})` | mesmos contadores após substituição pelo seed; somente DB da aplicação |

Tokens de edição/estado são obrigatórios; UI os obtém ao abrir formulário/detalhe. Conflito instrui recarregar o registro preservando entrada visível. Checar existência e token atual antes de tratar no-op; estado idempotente com token atual não altera nada. A revisão da base é lida ao abrir o diálogo de substituição. Se mudar antes de confirmar, retornar CONFLICT, pedir nova inspeção/confirmar com revisão atual; não sobrescrever edição de outra aba silenciosamente. `confirmacao:true` representa decisão da UI, não autenticação ou segurança contra código arbitrário.

## Filtros

`{texto?:string,municipio?:string,uf?:string,categoria?:Categoria,situacao?:'compativeis'|'indisponiveis'|'inativas'|'todas'}`. Branco/whitespace omite filtro; situacao omitida = compativeis. Texto máximo 120 caracteres normalizados, município 80; UF exige enum brasileiro após uppercase em UI. Rejeitar desconhecidos, tipo errado, enum inválido e excesso de comprimento com FILTER_INVALID. Não truncar. Município por igualdade de chave sem acentos; texto substring em nome OU recurso; demais filtros AND. Disponibilidade efetiva e ordenação lexical exatamente spec 02. Lista não soma quantidades nem converte unidades. Instituições sem ofertas aparecem em sua própria lista, não na consulta de ofertas.

## Persistência e falhas

Repositório interno expõe `lerEstado()` e `mutarEstado(transformar)`. O transformador síncrono lê snapshot+meta **dentro da mesma transação readwrite** e retorna próximo estado validado ou lança AppError; uma única store `estado` serializa RMW entre abas. Escrever snapshot e meta juntos, incrementar revisao somente quando houver mudança. Cascade usa mesmo instante UTC para todas entidades alteradas. Abort/erro/quota preserva estado anterior. Não produzir efeitos de UI/download dentro de transação. Migração/seed e validação do conjunto seguem spec 09; não há método de excluir banco público aos formulários.

| code | Condição / tratamento UI |
|---|---|
| VALIDATION_ERROR | Campos/tipos inválidos; mensagem por campo; foco no resumo/primeiro campo |
| DUPLICATE | Identificação ou combinação de oferta existente inclusive inativa; indicar editar/reativar |
| NOT_FOUND | ID ausente; tela não encontrado, link de retorno |
| INSTITUTION_INACTIVE | Criar/editar/reativar oferta com instituição inativa; explicar reativação |
| FILTER_INVALID | Filtro inválido; preservar filtros e resultados anteriores identificados como anteriores |
| CONFIRMATION_REQUIRED | Substituição/mudança de estado sem confirmação explícita; nenhuma gravação |
| CONFLICT | Timestamp/revisão mudou; nenhuma gravação; recarregar e revisar |
| IMPORT_INVALID | JSON malformado/schema, campos, duplicatas/vínculos/estados inválidos; arquivo inteiro rejeitado; indicar caminho como ofertas[0].quantidade |
| VERSION_UNSUPPORTED | schemaVersion/DB de versão incompatível; sem reset automático |
| LIMIT_EXCEEDED | >2 MiB ou >1.000 instituições/>5.000 ofertas; sem gravação |
| STORAGE_UNAVAILABLE | IndexedDB ausente/negado; ações de escrita impedidas, sem fallback volátil |
| STORAGE_BLOCKED | Upgrade impedido por outra aba; orientar fechar/recarregar abas |
| STORAGE_QUOTA | QuotaExceededError; preservar entrada e base anterior; recomendar exportar se leitura disponível |
| STORAGE_ERROR | Abort/falha não classificada/corrupção; sem alegar salvamento; manter entrada |
| EXPORT_ERROR | UI não pôde gerar/baixar arquivo; dados preservados, permitir tentar novamente |

Precedência: validação do formato do comando → existência/tokens → regras de negócio/conjunto → escrita. Erro nativo de storage nunca mascarado como erro de campo. Import valida antes de iniciar gravação; confirmação e revisão são conferidas no commit transacional. Mensagens de duplicidade são as da spec 02.

## JSON de intercâmbio — schemaVersion 1

Objeto raiz com **somente** `schemaVersion` (número inteiro 1), `exportedAt` (ISO UTC canônico), `instituicoes` (array de Instituicao) e `ofertas` (array de Oferta). Nomes em português são normativos; `institutions`/`offers` não são aliases. Entidades têm todos campos de spec 02; opcionais contato/observacoes ausentes são completados como string vazia; demais campos obrigatórios. Export sempre emite opcionais. Arquivo não contém meta/revisao/chave. Import exige strings canônicas após normalização da spec 02 (não corrige espaços, caixa de identificacao/UF ou tipos silenciosamente). Chaves de busca são derivadas, não persistidas/exportadas.

Exemplo válido mínimo com instituição e oferta fictícias:

```json
{
  "schemaVersion": 1,
  "exportedAt": "2026-10-09T12:00:00.000Z",
  "instituicoes": [{
    "id": "11111111-1111-4111-8111-111111111111",
    "nome": "Instituição Demo Alfa", "tipo": "empresa",
    "identificacao": "DEMO-EMP-001", "uf": "RS", "municipio": "Cidade Alfa",
    "contato": "demo@example.org", "observacoes": "Registro fictício",
    "estado": "ativa", "createdAt": "2026-10-01T12:00:00.000Z",
    "updatedAt": "2026-10-01T12:00:00.000Z"
  }],
  "ofertas": [{
    "id": "22222222-2222-4222-8222-222222222222",
    "instituicaoId": "11111111-1111-4111-8111-111111111111",
    "categoria": "agua", "recurso": "Água mineral", "quantidade": 10,
    "unidade": "litro", "disponibilidade": "disponivel", "estado": "ativa",
    "observacoes": "Disponibilidade fictícia",
    "createdAt": "2026-10-01T12:00:00.000Z", "updatedAt": "2026-10-01T12:00:00.000Z"
  }]
}
```

Base vazia válida: `{ "schemaVersion":1,"exportedAt":"2026-10-09T12:00:00.000Z","instituicoes":[],"ofertas":[] }`. Importá-la grava meta inicializada, portanto recarga não aplica seed.

Exemplos inválidos: `schemaVersion:2` → VERSION_UNSUPPORTED; `quantidade:"10"` → IMPORT_INVALID; oferta disponível com 0 → IMPORT_INVALID; instituição inativa com oferta ativa → IMPORT_INVALID; instituicaoId ausente no conjunto importado → IMPORT_INVALID; duplicata normalizada → IMPORT_INVALID; arquivo >2 MiB → LIMIT_EXCEEDED. Não mesclar com base anterior nem procurar referências nela. Restauração substitui somente snapshot/meta deste DB, sem `localStorage.clear()`, limpeza de origem ou `deleteDatabase` indiscriminado.

## Invariantes adicionais após revisão

Toda edição/mudança de estado exige expectedRevision igual à revisão atual além de expectedUpdatedAt; tokens obtidos no mesmo snapshot da tela. Import/restore preservam datas mas incrementam revisão, impedindo sobrescrita por formulário anterior. Após qualquer CONFLICT, recarregar e revisar.

Toda mutação valida que JSON exportável formatado com indentação2, envelope schemaVersion/exportedAt UTC de24 caracteres, instituicoes/ofertas ocupa <=2MiB UTF8. Exceder gera LIMIT_EXCEEDED antes de gravar. Logo toda base válida pode ser exportada/reimportada. Limites de entidades continuam1000/5000, mas limite de bytes também pode restringir a base.
