# Seção 1 — Anchor (abaixo da Hero)

## Estrutura visual

- **Tema:** Dark (fundo #000, texto branco)
- **Layout:** Headline gigante centralizada + lede + 2 CTAs + trust bar
- **Função:** Ancorar o argumento principal do produto logo após o impacto visual da hero

## Copy

```
[EYEBROW]
ORIENT — DESDE 1950

[HEADLINE — em Cormorant Garamond peso 300, gigante]
Engenharia japonesa.
No seu pulso.

("No seu pulso." em destaque com cor accent warm dourada)

[LEDE]
Movimento de quartzo de precisão. Caixa em aço inoxidável.
Resistência à água certificada. O primeiro relógio que você
compra para usar pelos próximos dez anos.

[CTAs — dois botões lado a lado]
Botão 1 (primary, branco com texto preto): "Comprar agora"
Botão 2 (secondary, transparente com borda): "Ver especificações"

[TRUST BAR — no rodapé da seção]
Mais de 70 anos fabricando relógios · Movimento desenvolvido no Japão
```

## Notas de execução

- Headline usa `<br>` pra quebrar entre "japonesa." e "No seu pulso."
- A cor accent é `--accent-warm` (dourado ~#C9A86A) — herança da hero
- Trust bar tem `border-top: 1px solid var(--ds-border)` pra separar
- Padding vertical generoso: `clamp(80px, 14vh, 180px)`

## Sem mídia gerada

Esta seção é 100% tipografia. Nenhuma imagem ou vídeo.
