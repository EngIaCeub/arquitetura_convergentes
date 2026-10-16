# Plano de publicação — GitHub e GitHub Pages

Estado: planejamento atualizado em 2026-10-09. Nenhum push, workflow, configuração remota ou deploy foi executado por este ajuste.

Este documento substitui a arquitetura anterior de API HTTP + SQLite local. Quando houver referência histórica incompatível nos demais planos, prevalece a arquitetura estática descrita aqui. G0–G8 continuam sequenciais; G9 passa a ser obrigatório para entrega publicada.

Etapa visual obrigatória: [PLANO_VISUAL_RETRO_NEON.md](PLANO_VISUAL_RETRO_NEON.md). GV ocorre entre G4/G5; G9.5 deve conferir tema, assets e movimento reduzido na URL pública. P0 passa a preparar nove skills locais.

## 1. Destino e alcance

- Remote origin observado: https://github.com/EngIaCeub/arquitetura_convergentes.git.
- URL padrão esperada, ainda não verificada como publicada: https://engiaceub.github.io/arquitetura_convergentes/.
- Na execução, confirmar visibilidade, acesso de escrita, branch padrão, elegibilidade do Pages e permissões de Actions. Não assumir que origin observado comprova autorização técnica ou configurações remotas.
- Entrega: código no GitHub, demonstração web no Pages, instruções e pacote acadêmico com vídeo.
- Usar somente dados fictícios e evitar incluir PDFs originais no artefato público por conveniência; publicar apenas arquivos necessários ao site. Fontes bibliográficas podem ser referenciadas nos materiais.

## 2. Arquitetura adotada

```text
GitHub repository → GitHub Actions: testes/build → artefato estático → GitHub Pages
                                                                     ↓
Navegador: interface web → serviços de domínio JavaScript → IndexedDB
                         importação/exportação JSON ↔ arquivo local
```

Tecnologias com funções distintas para a atividade: aplicação web HTML/CSS/JavaScript para interação; IndexedDB para banco estruturado e persistência; JSON para intercâmbio e recuperação de dados; GitHub Actions para automação de verificação e publicação; GitHub Pages para hospedagem estática. Três camadas de código não serão apresentadas como três tecnologias por si só.

Sem API HTTP ou backend remoto nesta entrega. A spec 04 passa a documentar interfaces dos serviços e repositório de dados, operações assíncronas, schema JSON e erros, em vez de rotas HTTP. G2 escolherá ferramenta de build e testes, com poucas dependências.

### Persistência e limites

- Dados armazenados por origem no navegador, não no repositório nem em servidor central.
- Cadastro feito por um visitante não aparece automaticamente para outro visitante, dispositivo ou perfil.
- Recarregar/fechar e reabrir o navegador preserva dados enquanto o armazenamento não for removido pelo usuário ou navegador. Não prometer armazenamento permanente.
- Localhost e URL Pages têm origens distintas: não compartilham dados. Importar/exportar JSON é o mecanismo explícito de transferência.
- Seed fictício somente na primeira inicialização; deploy e recarga não devem sobrescrever registros existentes. Mudança de schema exige migração versionada.
- Exportação preserva versão e relacionamentos. Importação valida arquivo inteiro antes de gravar, informa conflitos e usa transação; erro não pode deixar importação parcial.
- Restaurar dados demonstrativos exige confirmação explícita na interface e afeta apenas o armazenamento desta aplicação. Não limpar armazenamento de outros apps na mesma origem.
- Informar na interface: demonstração acadêmica, dados locais ao navegador, exportação recomendada para preservar alterações.
- Base compartilhada e operação institucional real requerem backend externo e novo escopo. Não simular colaboração usando commits do GitHub ou token embutido no frontend.

## 3. Specs e estrutura revisadas

```text
specs/04-contrato-servicos.md      # substitui contrato-api.yaml
specs/09-operacao-local.md        # desenvolvimento e build servido por HTTP
specs/10-publicacao-pages.md      # destino, pipeline, base path, evidências e rollback
src/ui/
src/domain/
src/storage/
public/                          # somente assets públicos necessários
.github/workflows/ci.yml          # futuro: testes/build em PR
.github/workflows/pages.yml       # futuro: publicação da branch padrão
dist/                            # artefato gerado, fora do controle de versão
evidence/G9/
```

Não usar docs/ como raiz de publicação: a documentação do planejamento deve continuar separada do artefato do aplicativo.

Usar caminhos relativos ou base path configurado para `/arquitetura_convergentes/`. Preferir navegação por hash ou tela única, para recarga não exigir reescrita de rotas que o Pages não fornece. Não incluir service worker no escopo inicial; isso reduz custo de cache e atualização.

## 4. Pipeline planejado

PR: instalação reproduzível, testes, build e verificação do artefato; não publicar de PR. Push na branch padrão verificada: mesmos checks e deploy apenas se passarem. Permitir execução manual para recuperação.

Jobs separados: verify/build → deploy → smoke publicado. O deploy usa artefato gerado pelo mesmo commit validado, `index.html` na raiz, ambiente `github-pages`, permissões mínimas de `contents: read`, `pages: write` e `id-token: write` conforme necessidade do job. Sem PAT incorporado no aplicativo. Confirmar versões vigentes das actions quando criar o workflow.

Controlar concorrência por ambiente para evitar deploys competindo. Checks de persistência e importação são executados no navegador em ambiente local/CI; smoke público confirma assets, navegação e fluxo básico na origem publicada.

## 5. Agents e skills

Manter os modelos/esforços planejados, sem criar agente permanente novo:

| Perfil | Responsabilidade adicional | Skill |
|---|---|---|
| Especificador, Sol/medium | Contrato de armazenamento, JSON, base path e spec 10 | especificar-contratos |
| Implementador, Sol/medium | IndexedDB, migração, exportação/importação e build | implementar-fatia |
| Publicador, Sol/medium | Perfil temporário do implementador para GitHub Actions e Pages | publicar-pages |
| Verificador, Luna/high | Reprodução, smoke público, URL e assets | validar-gate |
| Revisor, Sol/high | Integridade, importação e permissões do workflow | validar-gate |
| Produtor, Luna/high | README, links e pacote com versão publicada | preparar-entrega |
| Coordenador, Sol/medium | Gates, commit/release, evidências e rollback | validar-gate |

Nova skill local proposta `publicar-pages`: entradas = build validado, spec 10, repositório/branch confirmados; procedimento = revisar diff/artefato, conferir permissões, publicar, aguardar Actions e validar URL; saídas = SHA, run, deployment, URL e smoke; falha = registrar erro e executar rollback documentado se necessário. Não executar deploy antes dos gates de preparação nem afirmar sucesso apenas por push aceito.

Não usar Sites hosting, pois o destino solicitado é explicitamente GitHub Pages. OpenAI Docs só volta a ser necessária se houver alteração de modelos/configuração de agentes; não é necessária para publicar este site.

## 6. Mudanças obrigatórias nos gates existentes

| Gate | Ajuste |
|---|---|
| P0 | Criar nove skills locais, incluindo publicar-pages e as duas skills visuais; acrescentar perfil publicador reutilizando implementador |
| G0 | Escopo passa a demonstração pública, com persistência individual e dados fictícios |
| G1 | Acrescentar exportar, importar, primeira inicialização, migração e recuperação demonstrativa; limites de compartilhamento explícitos |
| G2 | Substituir API/SQLite por serviços JS/IndexedDB; definir base path, rotas hash, build estático, spec 10 e armazenamento versionado |
| G3 | Comprovar cadastro e persistência após recarga e reabertura; seed não sobrescreve dados |
| G4 | Implementar importação/exportação e restauração demonstrativa além de edição/filtros |
| G5 | Testar armazenamento indisponível, migração, transações, JSON inválido, XSS em campos importados, recarga em subpath e build sem backend |
| G6 | Medir com base/ambiente congelados; registrar se usa build local ou publicado, sem misturar amostras |
| G7 | Slides e roteiro apresentam arquitetura estática e limite de dados locais; URL ainda não publicada fica marcada como prevista |
| G8 | Conferir pacote e vídeo antes da publicação; G8 PASS não significa entrega pública concluída |

## 7. G9 — Publicação e validação pública

Meta: disponibilizar o sistema no GitHub Pages com correspondência entre código, artefato e evidências.

| ID | Task | Skill / perfil | Depende de | Aceitação |
|---|---|---|---|---|
| G9.1 | Confirmar repositório, branch padrão, autenticação, permissões e configuração Pages | publicar-pages / publicador | G8 PASS | Destino confirmado e permissões suficientes; bloqueios reais registrados; não alterar visibilidade automaticamente |
| G9.2 | Criar/revisar CI e workflow Pages conforme spec 10 | publicar-pages / publicador; VG / revisor | G9.1 | PR não publica; deploy depende de checks; permissões mínimas; artefato sem fontes privadas/segredos |
| G9.3 | Executar checks finais, versionar arquivos necessários e enviar ao GitHub | publicar-pages / publicador | G9.2 | Diff revisado, commit SHA e branch registrados; nenhum git add indiscriminado de PDFs/tmp; se houver PR criada, anexá-la ao chat |
| G9.4 | Habilitar fonte GitHub Actions quando necessário e executar publicação | publicar-pages / publicador | G9.3 | Run e deployment do SHA esperado concluídos; URL obtida da implantação, não presumida |
| G9.5 | Testar URL HTTPS pública, assets, recarga, cadastro, filtros e persistência | validar-gate / verificador | G9.4 | Smoke passa em navegador limpo; nenhum 404 de assets; dados persistem na mesma origem; outro perfil possui base independente |
| G9.6 | Conferir rollback e recuperação | publicar-pages + VG / publicador/revisor | G9.5 | Procedimento reproduzível para republicar último commit aprovado sem force-push; esquema IndexedDB compatível ou estratégia de recuperação documentada |
| G9.7 | Atualizar README, apresentação, pacote e STATUS com links reais | preparar-entrega + VG / produtor/coordenador | G9.6 | Código/run/site/SHA ligados; pacote alterado revalidado; todos os gates PASS; publicar resultado não depende de URL estimada |

Se a URL publicada alterar o ambiente usado no indicador ou a demonstração gravada, registrar a diferença e repetir medição/gravação somente se a mudança invalidar a evidência. Rollback de arquivos do site não desfaz automaticamente migrações ou dados no navegador.

## 8. Critério de entrega final

Código acessível no repositório confirmado; Pages validado por HTTPS; base fictícia e limitação de persistência visíveis; exportação/importação funcional; testes/build/run e SHA registrados; pacote e vídeo conferidos; ausência de defeitos críticos/altos. Falha de permissão ou workflow deixa G9 pendente/FAIL, não converte URL prevista em entrega.

Fontes técnicas consultadas:
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

## Decisão vigente — 2026-10-16
Pedido direto de publicação web autoriza G9 antes do vídeo e ZIP acadêmicos de G8. A conclusão técnica do deploy não aprova a entrega acadêmica completa. Manter G8 PENDING e aplicar os demais checks de G9 normalmente.
