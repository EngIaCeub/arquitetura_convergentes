# Instruções de abertura e demonstração

## Abrir a apresentação

Abra `index.html` em um navegador atualizado. O HTML contém estilos, diagrama e navegação; mantenha a pasta `assets/` junto dele para exibir as três capturas. Em tela larga, use os botões ou as teclas ←/→, Page Up/Page Down, Home/End e espaço. O indicador mostra a posição entre oito slides. Em tela estreita, o material passa para leitura vertical; os controles continuam disponíveis. Selecione uma captura para abrir o PNG original e ampliá-lo.

## Abrir o protótipo para a demonstração

Na raiz do projeto, com Node.js 24 ou superior instalado, execute:

```powershell
node scripts/build.mjs
node scripts/serve.mjs
```

Abra `http://127.0.0.1:4175/arquitetura_convergentes/` no navegador. O servidor local disponibiliza a aplicação estática para uso; não use `file://` para a aplicação. A base demonstrativa é fictícia e o IndexedDB fica associado ao perfil/origem local.

Para demonstrar: abra Ofertas, mostre os filtros e resultados, aplique uma consulta combinada, aponte o formulário e apresente a opção de backup/exportação JSON. Use um perfil de navegador de demonstração e não insira dados reais. Se precisar repor a base fictícia, use “Restaurar dados demonstrativos” após ler o aviso; exporte antes se precisar preservar alterações locais. As capturas do HTML documentam a interface; elas não substituem uma gravação real.

## Limites operacionais

Os dados não são hospedados no Pages nem sincronizados entre navegadores. Transferência exige exportação e importação explícitas. A demonstração usa somente registros fictícios e persiste no perfil/origem local.

O roteiro estima 4min18s: 395 termos de fala pela regex JavaScript `/[\p{L}\p{N}]+(?:[.,]\p{N}+)?/gu` (ela conta `0,4` como um termo), divididos por 120 termos por minuto (197,5s), mais 60s de demonstração, arredondados para cima. Não houve ensaio oral ou gravação. G8 exige vídeo real com áudio de até cinco minutos; confirme duração, áudio/imagem e funcionamento das ações mostradas.
