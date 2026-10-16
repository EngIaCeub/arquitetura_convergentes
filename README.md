# arquitetura_convergentes
Sistematização disciplina arquiteturas convergentes

## Execução do projeto

- [Status](docs/STATUS.md)
- [Quadro de tarefas](docs/TAREFAS.md)
- [Rastreabilidade](docs/RASTREABILIDADE.md)
- [Skills locais](docs/SKILLS_DO_PROJETO.md)
- [Perfis de agentes](agents/perfis.yaml)

P0/G0/G1/G2/G3/G4/GV/G5 aprovados; G6 aprovado no alcance técnico sintético. G7 aprovado nos materiais acadêmicos; G8 acadêmico pendente; demonstração publicada no GitHub Pages por solicitação direta. Perfis são política de delegação, não configuração nativa automática. Consultar AGENTS.md antes de executar tarefas.

## Executar a demonstração

Requisito: Node.js24 ou superior. Não requer servidor de banco, conta ou API.

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

Abrir http://127.0.0.1:4175/arquitetura_convergentes/. O servidor entrega somente dist. Não abrir index.html por file://.

Testes de domínio: `node --test tests/*.test.mjs`.
QA de navegador: instalar pnpm11.25.0, executar `pnpm install --frozen-lockfile`, `pnpm exec playwright install chromium` e `node tests/browser.mjs` com servidor ativo. Variáveis de teste opcionais descritas na spec09.

Demonstração acadêmica com dados fictícios, armazenados somente no navegador/origem. Não representa cadastro nacional oficial, estoque confirmado ou operação institucional. Não cadastrar dados reais. Base de outro visitante/perfil não é compartilhada. Exportar JSON permite transferir/preservar uma cópia. Importar ou restaurar substitui a base local após confirmação.

QA completo adicional: `pnpm run test:qa` com servidor ativo. Inclui falhas injetadas de armazenamento/download, concorrência, limites, navegação, teclado e volume; evidências em `evidence/G5`. Os testes criam contextos descartáveis. `node tests/visual.mjs` verifica tema e estados nos três viewports.

Indicadores: [protocolo](specs/07-indicadores.md) e [resultados técnicos](evidence/G6/resultados.md). `node scripts/g6-calculate.mjs` reproduz cálculos a partir de raw.json e confere hashes (build dist atualizado necessário). Para novo ensaio sintético: `node scripts/g6-measure.mjs` com servidor ativo e Playwright; depois recalcular e revisar.480/480 consultas corretas em8tarefas, mediana geral0,4ms em ambos métodos; nenhuma economia humana demonstrada.

## Materiais acadêmicos — G7 PASS

Integrante: **Felipe Paz Santiago**. [Apresentação](output/G7/index.html), [roteiro](output/G7/roteiro.md), [instruções](output/G7/instrucoes.md) e [revisão independente](evidence/G7/review.md). A apresentação pode ser aberta localmente com sua pasta de assets. Estimativa do pitch: 4min18s; gravação real e ZIP final ainda pendentes em G8.

## Site publicado

Acesse https://engiaceub.github.io/arquitetura_convergentes/. [Execução validada](https://github.com/EngIaCeub/arquitetura_convergentes/actions/runs/38854955465), versão publicada f0c0a02d1fb4c9b1e3b5321ebc3b87e2568d662a. Dados fictícios individuais por navegador/origem; o banco local não é compartilhado entre visitantes. Vídeo e ZIP acadêmicos G8 continuam pendentes. Publicação antecipada autorizada pelo pedido direto de 2026-10-16.

[Evidências técnicas](evidence/G9/review.md) e [recuperação](evidence/G9/rollback.md).
