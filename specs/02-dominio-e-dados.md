# 02 — Domínio e dados

Estado: G1 PASS documental após revisão independente (evidence/G1/review.md). Regras de domínio normativas para UI, armazenamento e futuro intercâmbio. G2 definirá schema de arquivo e contratos técnicos sem contrariar estas regras.

## Entidades e cardinalidade

Instituição 1 → 0..N ofertas; oferta → exatamente 1 instituição existente. Categoria é enum fixo, não entidade editável. IDs são UUID gerados pela aplicação, imutáveis. No import, IDs válidos preservados e únicos por entidade; referências devem resolver na base importada. Sem exclusão física individual. Nenhum vínculo com base oficial.

### Instituição

| Campo | Tipo / limites | Regra |
|---|---|---|
| id | UUID string | Gerado; não editável |
| nome | texto 2–120 caracteres | Obrigatório; espaços normalizados |
| tipo | empresa, organizacao, orgao_publico, coletivo | Obrigatório; rótulos Empresa, Organização, Órgão público, Coletivo |
| identificacao | texto 2–40 | Obrigatório; código fictício fornecido pelo operador, único em toda base, inclusive inativos |
| uf | enum das 27 siglas brasileiras | Obrigatório, uppercase; representa localização fictícia de demonstração |
| municipio | texto 2–80 | Obrigatório; sem geocodificação ou afirmação de vínculo municipal real |
| contato | texto 0–120 | Opcional, descrição fictícia; emails de demonstração com domínio example.org; sem validação de canal real |
| observacoes | texto 0–500 | Opcional; texto simples |
| estado | ativa, inativa | Criação sempre ativa |
| createdAt, updatedAt | string data UTC ISO 8601 canônica | Gerados; updatedAt >= createdAt |

### Oferta

| Campo | Tipo / limites | Regra |
|---|---|---|
| id | UUID string | Gerado; não editável |
| instituicaoId | UUID | Existente e ativa para criar/editar/reativar oferta; não pode ser trocado após criação |
| categoria | enum abaixo | Obrigatório |
| recurso | texto 2–120 | Obrigatório; descrição como Água mineral 1L ou Caminhão |
| quantidade | inteiro 0..1000000 | Valor finito; sem decimais ou coerção de texto no import |
| unidade | enum abaixo | Obrigatória e compatível com categoria |
| disponibilidade | disponivel, indisponivel | Disponível exige quantidade >=1; indisponível aceita zero ou positivo |
| estado | ativa, inativa | Criação sempre ativa |
| observacoes | texto 0–500 | Opcional |
| createdAt, updatedAt | data UTC ISO 8601 canônica | Como instituição |

Local da oferta é sempre o município/UF atual da instituição; não há endereço separado, transferência ou cobertura regional. Quantidade descreve disponibilidade declarada; não é movimentação de estoque. Editar quantidade não registra consumo, reserva ou entrega.

## Identificação, CNPJ e duplicidade

Decisão: CNPJ não será coletado nem obrigatório para nenhum tipo. Trata-se de demonstração fictícia sem validação institucional; usar código explícito evita simular autenticidade documental e atende coletivos sem CNPJ. Não deduzir obrigação de CNPJ de recebedor no procedimento SERS para doadores deste protótipo. G1 não implementa validador fiscal.

Todos os tipos usam identificacao, por exemplo DEMO-EMP-001 ou DEMO-COL-001. Normalização da chave: Unicode NFKC, trim, colapso de espaços internos e uppercase; não remover pontuação. DEMO-001 e demo-001 conflitam; DEMO-001 e DEMO001 são distintos. Não há unicidade por nome ou contato: instituições homônimas são permitidas com código diferente. Erro: “Já existe instituição com esta identificação, inclusive entre inativas.” Editar o próprio registro mantendo a chave é permitido.

Demais textos: NFKC, trim e espaços consecutivos colapsados antes de medir limites; campos opcionais ausentes viram string vazia. Rejeitar texto com caracteres de controle (exceto whitespace transformado em espaço). Nome não pode ficar vazio. Import deve cumprir os mesmos valores normalizados, sem converter número em texto. UF é normalizada para uppercase nos formulários; import exige sigla canônica.

Oferta duplicada: rejeitar mesma combinação instituicaoId + categoria + recurso normalizado para comparação + unidade em qualquer estado. Comparação de recurso usa chave de busca abaixo. Permitir recurso com unidade diferente, sem agregar. Erro: “Esta instituição já possui oferta deste recurso e unidade; edite ou reative a existente.” Editar a própria oferta mantendo chave é permitido.

## Categorias e unidades

| Categoria | Unidades permitidas |
|---|---|
| alimentacao | unidade, kit, kg, litro |
| agua | unidade, litro |
| higiene_limpeza | unidade, kit, kg, litro |
| vestuario | unidade, kit |
| abrigo | unidade, kit |
| equipamentos | unidade |
| transporte | unidade |
| outros | unidade, kit, kg, litro |

Quantidade é sempre inteira: 2 kg permitido, 2,5 kg não. Água 1L pode ser descrita como recurso e contada em unidades ou litros; são ofertas diferentes, sem conversão automática. Transporte/equipamento representam número de itens declarados, sem motorista, capacidade, rota ou agenda.

## Estados e transições

| Ação | Pré-condição | Efeito |
|---|---|---|
| Criar instituição | Dados válidos e código único | ativa |
| Desativar instituição | Existente; confirmação | inativa; todas ofertas passam a inativa na mesma operação; disponibilidades/quantidades preservadas |
| Reativar instituição | Existente; confirmação; dados válidos | ativa; ofertas continuam inativas |
| Criar/editar oferta | Instituição ativa; dados válidos | Criar ativa; editar preserva estado; update de quantidade/disponibilidade juntos |
| Desativar oferta | Existente; confirmação | inativa; quantidade/disponibilidade preservadas |
| Reativar oferta | Instituição ativa, confirmação e dados válidos | ativa; disponibilidade declarada preservada |
| Alterar disponibilidade na edição | Instituição ativa; oferta ativa ou inativa | disponivel exige quantidade >0; indisponivel não zera quantidade automaticamente |

Instituição inativa pode ter seus próprios dados editados; ofertas inativas só podem ser editadas quando sua instituição estiver ativa. Desativar/reativar registro que já está no estado solicitado é no-op idempotente, sem alterar timestamps; reativação de oferta ainda exige instituição ativa. ID inexistente sempre retorna não encontrado. No cascade, somente ofertas que mudam estado recebem updatedAt novo; todos os registros modificados usam o mesmo instante UTC. Nunca modificar createdAt. Relógio lógico local mantém updatedAt >= anterior/createdAt mesmo se relógio do dispositivo recuar; detalhes técnicos em G2.

Import rejeita oferta ativa sob instituição inativa e toda inconsistência de estado/quantidade; não tenta corrigi-la silenciosamente. Oferta inativa pode conservar disponibilidade disponivel e quantidade positiva, mas disponibilidade efetiva é falsa.

## Busca, ordenação e compatibilidade

Chave de busca de textos: NFKD, remover marcas diacríticas, lowercase, trim e colapsar espaços. Texto busca substring em nome da instituição OU recurso; demais filtros combinam por AND. Município usa igualdade da chave normalizada; UF usa igualdade canônica; categoria usa igualdade de enum. Município sem UF pode retornar homônimos de diferentes estados, sempre exibindo UF. Não há busca por contato/observações.

Filtro situacao: compativeis (padrão), indisponiveis, inativas, todas. Compativeis: instituição ativa AND oferta ativa AND disponivel AND quantidade>0. Indisponiveis: instituição ativa AND oferta ativa AND indisponivel. Inativas: instituição inativa OR oferta inativa. Todas inclui todos. Modos são exclusivos; filtros de localização/texto/categoria continuam aplicados a qualquer modo.

Ordenação ascendente por chave do recurso, depois chave do nome da instituição e por UUID da oferta em comparação lexical. Sem depender da ordem de inserção/locale. Sem paginação obrigatória em G1; desempenho/volume da base serão delimitados em G2. Resultado é lista de ofertas; não somar quantidades entre unidades ou ofertas. Filtros em branco são omitidos; enum desconhecido ou município acima do limite gera “Filtro inválido”, sem executar consulta.

Exemplos normativos (instituições fictícias):

- I1 ativa, município Cidade Alfa/RS; O1 agua, Água mineral, 10 litro, ativa/disponivel; O2 agua, Galão, 2 unidade, ativa/indisponivel.
- I2 ativa, Cidade Beta/RS; O3 higiene_limpeza, Kit higiene, 5 kit, ativa/disponivel.
- Sem filtros: O1, O3. agua + Cidade Alfa + RS + compativeis: O1. agua + indisponiveis: O2.
- Texto agua encontra O1 mesmo com acento no recurso. Cidade Gama: vazio. todas + agua: O1, O2.
- Desativar I1 torna O1/O2 inativas; compativeis mostra O3; inativas mostra O1/O2. Reativar I1 mantém O1/O2 inativas até reativação individual.

## Erros e gravação

Categorias de erro de domínio: campo inválido, duplicidade, não encontrado, instituição inativa e filtro inválido. Erros de armazenamento: indisponível, quota e falha de operação. Campos inválidos são vinculados ao formulário; erro de armazenamento é apresentado globalmente com preservação da entrada para nova tentativa. Gravação falha não pode aparecer como sucesso.

Toda mutação valida antes de gravar; cascade, importação e restauração exigem atomicidade. Restauração/importação afetam somente stores da aplicação e dependem de confirmação; não apagar outros apps da mesma origem. Importação substitui, não mescla; preserva IDs e datas válidos e testa unicidade/vínculos no conjunto de destino. Assinaturas de serviço, versão JSON, limites de arquivo, migrações e seed serão definidos em G2.
