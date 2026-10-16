---
name: validar-gate
description: Verificar gates do Cadastro de Doadores contra specs e evidências reais, incluindo estilo retro neon, persistência, resultados e publicação, sem confundir planejamento com execução.
---

# Validar gate

## Escopo

Receber gate/task, critérios, versão e arquivos relevantes. Ler apenas as specs aplicáveis e o gate em `docs/`; para GV usar `PLANO_VISUAL_RETRO_NEON.md`, para G9 usar `PLANO_DEPLOY_GITHUB_PAGES.md`. Ausência de STATUS ou evidência não prova conclusão.

## Procedimento

1. Relacionar critérios a artefatos e verificações. Reutilizar evidências apenas quando versão e critérios continuam válidos; repetir checks afetados por mudanças.
2. Executar cenários e analisar resultados completos. Processo iniciado não equivale a sucesso. Revisar comportamento observável e casos adversos pertinentes, não apenas testes do autor.
3. Registrar falhas com passos, esperado/observado, impacto e evidência. Não alterar aceitação para acomodar defeito. Correções voltam ao implementador salvo despacho explícito.
4. Entregar `evidence/<gate>/review.md`: versão, ambiente, comandos, resultados, limitações e recomendação PASS/FAIL/PENDING. Coordenador consolida STATUS e avanço.

## Checks por etapa

- G3/G4: múltiplas ofertas, integridade, validação, edição, filtros, desativação, recarga/reabertura. Importação JSON mantém vínculos; erro não grava parcialmente.
- GV/G5: 360/768/1440 px, zoom 200%, teclado, foco, diálogos, estados e movimento reduzido. Medir contraste de pares reais; build aprovado não substitui inspeção visual.
- G6: dados brutos e cálculos reproduzíveis; tempo técnico não equivale a tempo humano; amostra e natureza sintética/humana declaradas.
- G7/G8: 17 itens e cinco perguntas; vídeo real até cinco minutos; pacote extraído/testado em pasta nova, preservando workspace original.
- G9: URL real e deployment/SHA correspondentes; assets/subpath; persistência na origem publicada e base independente em outro perfil. URL prevista não é deploy comprovado.

## Resultado

Crítico: perda/corrupção importante ou exposição indevida. Alto: fluxo obrigatório impedido ou contrato/integridade essencial violado. Médio/baixo: impacto limitado explicitamente descrito. Classificar por impacto.

Não recomendar PASS com falha crítica/alta ou verificação obrigatória ausente. PENDING para dependência/evidência ausente; FAIL para critério testado e reprovado. Ferramenta de navegador indisponível é limitação, não aprovação. A skill não concede autorização para publicação ou comunicação externa.
