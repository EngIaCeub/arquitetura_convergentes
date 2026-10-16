# 11 — Identidade retro neon

GV.1–3 antecipados em G2; GV.4–10 implementados após G4. Referências do usuário: 1/3 cores violetas/ciano/magenta em consoles; 2 arcade noturno dominante; 4 profundidade modular; 5 violeta suave para detalhes. Referências visuais não entram no bundle. Identidade original de central de recursos, sem marcas/personagens.

Tokens: background #080B16; surface #12182B; raised #1B2340; text #F1F5FF; muted #B8C4DF; cyan #53E8FF; magenta #FF4FA3; violet #A58BFA; warning #FFD166; success #6EE7B7; danger #FF718A. Texto/acentos sobre as três superfícies: contraste medido em evidence/GV/contraste-candidatos.json, mínimo5.07. Filled cyan tem texto background; bordas essenciais/foco cyan (>=3). Não usar acento sobre outro acento para texto.

Corpo system-ui >=16px, line-height1.5; monospace para metadados/títulos curtos, sem fontes externas. Espaços8/16/24/32px; borda1px, foco3px com offset3px; painéis radius12px. Cabeçalho, navegação e resumos; área filtros e cartões; formulários rotulados. Contagens reais no produto, exemplificativas no preview. Form states vazio/erro/carregamento/sucesso textuais, aria-live, sem cor exclusiva.

>=1000px sidebar+main; 600–999 navegação compacta e cartões2col; <600 uma coluna, filtros/formulários full width. min-width:0 e overflow-wrap para textos longos. Sem overflow a360/768/1440, zoom200%; não esconder controles.

Hover/foco botões: transition transform/opacity160ms; press translateY1px; painel entrada opacity180ms opcional. Reduced motion remove animação/transform, mantendo foco e cor. Sem transition all, flashes, partículas, áudio ou efeitos contínuos. Glow estático localizado, grid/scanline decorativos só fundo pointer-events none.

Diálogo com foco Cancelar, Escape cancela, Tab contido e retorno ao acionador. Desativar/importar/restaurar têm avisos próprios. Preview original consulta+formulário em design/preview, sem storage; revisão por capturas reais em evidence/GV. Implementação posterior deve medir pares realmente usados e custo comparado ao modo reduzido.
