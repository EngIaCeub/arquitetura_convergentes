# 06 — Plano de validação

Versão 1, G2 documental. Todos cenários abaixo estão **planejados**, não executados. PASS G2 aprova coerência de contratos/preview; não aprova funcionalidades, acessibilidade completa ou benefício humano.

## Ferramentas e isolamento

`node --test` com fixtures determinísticas testa domínio puro. Persistência, serviços, abort e migração são testados com IndexedDB real no Playwright. Playwright + Chromium testa DOM, IndexedDB real, recarga, duas páginas da mesma origem e contextos independentes. Testes de bloqueio/erro podem usar injeção controlada identificada como sintética. Quota real varia por navegador; não prometer preencher disco do usuário. Versões, comandos, SHA/hash da base, origem, viewport e tipo de evidência são registrados com resultados brutos em evidence do gate responsável.

Node scripts/build.mjs e check do dist devem confirmar allowlist, ausência de backend/CDN/segredos/referências privadas, imports/assets relativos. Servir HTTP raiz e subpath antes de browser QA. Runtimes bundled são conveniência observada em G2; G3 declara package.json/lockfile. Navegador limpo/contexto temporário por cenário, DB isolado, sem afetar base do usuário. Never reset indiscriminado de origem.

## Matriz requisito → cenário → execução prevista

| Requisito / T da spec 01 | Verificação e evidência | Gate |
|---|---|---|
| RF01 T01–02 | Criar/recargar; normalização, UF, campos e duplicidade inclusive inativa; serviço + browser | G3/G5 |
| RF02 T03–04 | Instituição com duas ofertas; vínculo ausente/inativo, quantidade e unidade inválidos; snapshot preservado | G3/G5 |
| RF03 T05–06 | Detalhes consistentes/ausentes e lista vazia, UI sem falso erro | G3–4/G5 |
| RF04 T07–08 | Edição mantém ID/createdAt, muda updatedAt/filtros; duplicata/campo inválido e conflito não gravam | G4/G5 |
| RF05 T09–10 | Desativação em cascata atômica, cancelar, oferta isolada e idempotência | G4/G5 |
| RF06 T11–12 | Reativar instituição mantém ofertas inativas; oferta sob instituição inativa rejeitada | G4/G5 |
| RF07 T13–14 | Filtros AND, acentos, ordenação lexical/tie-break, zero, limpar e filtros inválidos | G4/G5 |
| RF08 T15–16 | Export vazio/preenchido e download simulado falho; base intacta | G4/G5 |
| RF09 T17–18 | Ida/volta exata salvo exportedAt/meta; importar inválido/abort sem alteração parcial | G4/G5 |
| RF10 T19–20 | Seed único, base vazia importada continua vazia; recarga/deploy não sobrescreve; restaurar/cancelar | G3–4/G5 |
| RN01 T21–22 | Fechar/reabrir contexto persistente temporário na mesma origem; DB negado/quota/abort sem sucesso falso | G3/G5 |
| RN02 T23 | Avisos e exportação; dois perfis/origens independentes | G5/G9 |
| RN03 T24–25 | Teclado, foco/diálogo, labels/alertas; 360/768/1440px, zoom 200%, reduced motion | GV/G5/G9 |
| RN04 T26 | Texto `<img src=x onerror=...>` em cadastro/import exibido literalmente; sem execução ou request indevido | G5 |

## Cenários técnicos adicionais obrigatórios

| ID | Aceitação observável |
|---|---|
| C01 — Concorrência | Duas conexões/páginas criam registros distintos em paralelo; ambas alterações presentes; leitura-modificação-gravação na mesma transação. Edição obsoleta CONFLICT; revisão alterada impede substituição |
| C02 — Abort | Provocar abort após preparar/escrever snapshot antes do commit; snapshot e meta/revisão anteriores intactos; sem anúncio de sucesso |
| C03 — Migração | DB ausente cria v1+seed; DB v1 válido reabre sem mudanças; DB versão futura bloqueia sem reset; metadata/snapshot parcial acusa corrupção; upgrade blocked fecha/orienta abas |
| C04 — Limites | 2.097.152 bytes aceitos se schema válido, +1 rejeitado; 1.000/5.000 registros válidos aceitos, +1 rejeitado; duplicidade e referências avaliadas no conjunto |
| C05 — Adversos JSON | Malformado, raiz/array/tipos errados, propriedade extra, schema desconhecido, UUID/data inválidos, data anterior, valores não canônicos, oferta ativa sob instituição inativa, duplicatas e referência órfã: rejeição integral |
| C06 — Relógio/estados | Dispositivo recua: updatedAt monotônico; cascade mesmo instante; no-op mantém timestamps/revisão; import futuro não torna próxima atualização anterior |
| C07 — Subpath | Build servido em raiz e /arquitetura_convergentes/; assets/imports sem 404, recarga em hash/detalhe, back/forward e caminho relativo intactos |
| C08 — Sanitização | UI usa textContent/DOM seguro para todo texto externo; arquivo não cria HTML/código; CSP opcional não substitui segurança de renderização |
| C09 — Volume | Base válida nos limites: registrar tempo de consultar/abrir/salvar/importar no mesmo ambiente; se interação bloquear perceptivelmente, revisar estratégia antes de liberar G5, sem promessa de FPS |

C01/C02/C03 planejados com IndexedDB real/Playwright e, quando aplicável, IndexedDB real; ambos identificados. Teste de API JavaScript isolado não equivale a fluxo completo com botão/formulário. Evidências browser incluem capturas/console/requests, dados antes/depois e resultados, sem inferir benefício humano.

## Gravidade e saída dos gates

- Crítica: perda/corrupção de dados, import parcial, sobrescrita concorrente, execução de conteúdo, segredo publicado. FAIL e interromper avanço.
- Alta: requisito P1 indisponível, falsa confirmação de gravação, seed sobrescrevendo base, ação essencial inacessível por teclado/mobile, asset/navegação quebrado. Corrigir antes de PASS.
- Média: defeito que prejudica uso mas tem alternativa verificável; registrar reprodução/impacto e corrigir se compromete aceitação.
- Baixa: acabamento sem impacto funcional/legibilidade, com pendência explícita.

G2 exige specs 03–06/09–11 coerentes, ambiente comprovado, preview desktop/mobile revisado e revisão independente; G3 exige T01–04/T19/T21 aplicáveis; G4 exige edição/estados/filtros/JSON/restauração; GV exige tema, contraste e teclado/movimento; G5 consolida T01–26+C01–09, instalação limpa e sem críticos/altos. G6 é protocolo humano/indicador separado: testes sintéticos não são avaliação humana. Gate só recebe PASS após autor corrigir e revisor conferir; até duas tentativas dirigidas, depois diagnóstico/escalonamento.
