# Instruções do projeto

## Escopo e fontes
Cadastro de Doadores Institucionais acadêmico. Arquitetura estática HTML/CSS/JS + IndexedDB + JSON, hospedagem GitHub Pages. Dados fictícios; persistência individual por navegador. Não introduzir API HTTP/SQLite remoto, sincronização ou dados reais sem mudança de escopo.

Consultar docs/STATUS.md e docs/TAREFAS.md antes de executar. Planos vinculantes: PLANO_DEPLOY_GITHUB_PAGES.md e PLANO_VISUAL_RETRO_NEON.md refinam o plano original. Specs do produto serão criadas nos gates respectivos; ausência não é aprovação.

## Gates
Ordem P0 → G0 → G1 → G2 → G3 → G4 → GV → G5 → G6 → G7 → G8 → G9. GV.1–3 são design antecipado em G2; GV fecha depois de G4. Não avançar sem PASS registrado. PASS exige artefato, verificação e evidência. PENDING indica falta de entrada/evidência; FAIL indica reprovação observada.

Aprovação técnica não exige confirmação humana em toda etapa. Não inventar fatos, resultados, participante, integrante, vídeo ou URL. Evidência sintética não demonstra benefício humano. Preservar PDFs e mudanças do usuário.

## Delegação
Usar perfis em agents/perfis.yaml e prompts correspondentes, com modelo/esforço explícitos quando disponíveis. Arquivos são política local, não configuração nativa automática. O usuário autorizou arquitetura de subagents; delegar tarefas delimitadas quando útil. Para fechar P0, solicitar revisão independente ao verificador. Subagents não criam descendentes.

Padrão coordenador + um trabalhador; máximo quatro agentes incluindo coordenador. Um escritor por arquivo. Fornecer entrada mínima e template de despacho. Revisor relata falhas; autor corrige. Autor não aprova sozinho o próprio gate. Até duas tentativas dirigidas antes de diagnóstico/escalonamento.

## Skills e evidências
Skills locais em .agents/skills; ler o SKILL.md pertinente. Não copiar skills globais para o bundle. Registrar comandos, resultados, limitações e arquivos em evidence/<gate> e atualizar STATUS/rastreabilidade após review. Modelos escolhidos não alteram o modelo principal automaticamente.

## Publicação
Preparar publicação conforme G9, depois de G8 PASS. Não publicar como efeito de P0; sem token no frontend, sem force-push ou alteração automática de visibilidade. Validar build, SHA, Actions, deployment e URL pública. Fontes e referências privadas ficam fora de dist.
