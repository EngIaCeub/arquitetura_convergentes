---
name: aplicar-tema-e-movimento
description: Implementar tema escuro retro neon e transições acessíveis no Cadastro de Doadores estático, preservando os fluxos, IndexedDB e compatibilidade com GitHub Pages.
---

# Aplicar tema e movimento

## Entradas

Para GV.4–GV.6 e correções visuais, ler `docs/PLANO_VISUAL_RETRO_NEON.md`, `specs/11-design-retro-neon.md` e os componentes/estilos existentes na raiz do projeto. Conferir G4 aprovado e preview revisado antes de iniciar a etapa. Arquivos ou evidências ausentes devem ser relatados, não presumidos.

## Implementação

- Centralizar tokens em CSS custom properties; reutilizar a estrutura existente, sem trocar stack para decorar.
- Cobrir navegação, formulários, filtros, listas, detalhes, diálogos e avisos; estados disabled, hover, focus-visible e pressed.
- Preservar semântica HTML, rótulos, ações e dados. Resumos numéricos vêm do armazenamento, não do mockup.
- Decoração não captura cliques/foco; evitar overflow ou recortes que cortem foco e rótulos.
- Preferir opacity/transform e transições curtas; evitar transition: all, partículas contínuas, glitch, áudio automático ou vídeo de fundo.
- Respeitar prefers-reduced-motion: remover movimento não essencial e manter feedback estático. Glow discreto, sem animar blur/sombras em toda a tela.
- Diálogos gerem foco, Escape e retorno ao acionador. Feedback não depende exclusivamente de cor.
- Manter assets e navegação compatíveis com o subpath Pages; sem caminhos Windows, URLs de localhost ou dependência de CDN no bundle.

## Verificação e saída

Executar testes relevantes e fluxos alterados; conferir 360/768/1440 px, zoom 200%, teclado, estados e movimento reduzido. Registrar capturas reais e resultados em `evidence/GV/`. Navegador indisponível deixa QA visual pendente.

Não alterar schemas, seed ou regras de disponibilidade para acomodar layout. Entregar estilos/componentes, checks, limitações e pendências ao revisor. Não aprovar o próprio gate nem publicar por efeito desta skill.
