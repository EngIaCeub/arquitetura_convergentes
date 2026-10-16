# Decisões de domínio G1

Data: 2026-10-09; aprovado documentalmente em G1 após revisão independente. Base: spec 00, arquitetura estática e dados fictícios.

1. Um operador local; nenhuma conta institucional. Reduz custo e respeita Pages/IndexedDB.
2. Código institucional obrigatório para todos os tipos; nenhum CNPJ. A formalização de recebedores SERS não é transportada para doadores fictícios.
3. Categorias fixas e quantidades inteiras com unidades explícitas; sem conversão, soma ou estoque transacional.
4. Desativação preserva dados e inativa ofertas em conjunto; reativação não republica ofertas automaticamente.
5. Unicidade inclui inativos; oferta duplicada usa instituição/categoria/recurso/unidade. O operador deve editar/reativar.
6. Importação substitui base mediante confirmação, sem mescla; evita conflitos ambíguos. G2 define mecanismo e schema.
7. Fonte RS/2024 fundamenta organização informacional; protótipo cobre ofertas, sem pedidos, logística ou alegação de integração oficial.

Aceitação detalhada: specs 01/02. Mudanças futuras exigem revisão de contratos/testes afetados. Não constitui implementação.
