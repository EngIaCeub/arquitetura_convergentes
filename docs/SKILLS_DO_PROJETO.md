# Skills do projeto

Atualizado em 2026-10-09. Nove skills locais criadas e aprovadas pelo quick_validate.py da skill-creator. Validação estrutural não equivale a executar GV ou a confirmar recarga automática do catálogo desta conversa.

| Skill criada | Etapa | Função |
|---|---|---|
| [definir-identidade-retro-neon](../.agents/skills/definir-identidade-retro-neon/SKILL.md) | GV.1–3 em G2 | Referências, tokens, componentes e preview |
| [aplicar-tema-e-movimento](../.agents/skills/aplicar-tema-e-movimento/SKILL.md) | GV.4–6 e correções | CSS, responsividade, estados e transições |
| [validar-gate](../.agents/skills/validar-gate/SKILL.md) | Gates, incluindo GV | Verificação e evidências PASS/FAIL/PENDING |

Carregar o SKILL.md explicitamente se a descoberta automática ainda não o mostrar. Skills não criam agentes nem fixam modelos; usar o plano de alocação existente.

## Skills restantes materializadas em P0

- [fundamentar-meta](../.agents/skills/fundamentar-meta/SKILL.md)
- [especificar-contratos](../.agents/skills/especificar-contratos/SKILL.md)
- [implementar-fatia](../.agents/skills/implementar-fatia/SKILL.md)
- [medir-indicador](../.agents/skills/medir-indicador/SKILL.md)
- [preparar-entrega](../.agents/skills/preparar-entrega/SKILL.md)
- [publicar-pages](../.agents/skills/publicar-pages/SKILL.md)

## Skills do ambiente, sem duplicação

- skill-creator: criar e atualizar skills locais.
- computer-use:computer-use: QA visual quando houver superfície compatível; não presumir controle nativo disponível.
- visualize:visualize: exploração opcional de alternativas na conversa; preview do projeto continua HTML/CSS.
- imagegen: ilustração bitmap original opcional; CSS/SVG preferidos para glow, painéis e ícones simples.

Esses recursos não são dependências de runtime do site. Não copiar pacotes globais para o bundle; ler instruções vigentes antes do uso.

## Status e validação

Os contratos detalhados das seis skills restantes e dos agentes estão em [P0_DEFINICOES_PENDENTES.md](P0_DEFINICOES_PENDENTES.md), para orientar sua materialização em P0.

As nove skills estão materializadas e estruturalmente validadas. Dez perfis documentais existem em agents/perfis.yaml e prompts associados. São instruções de delegação, não configuração nativa automática. Gates de produto continuam pendentes; P0 foi aprovado após revisão independente, conforme STATUS.md.

O Python empacotado não continha PyYAML; a dependência foi instalada somente em tmp/skill-validator-deps. O validador oficial retornou Skill is valid! para as nove skills, sem alterar dependências do site ou runtime global. Não houve teste comportamental de navegador: a aplicação e o preview ainda não existem.
