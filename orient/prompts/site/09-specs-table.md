# Seção 8 — Specs Table

## Estrutura visual

- **Tema:** Light
- **Layout:** `<dl>` semântico (definition list) com 11 pares chave-valor
- **Função:** Ficha técnica objetiva pra quem quer conferir specs antes de comprar

## Copy

```
[EYEBROW]
ESPECIFICAÇÕES

[HEADLINE]
Cada detalhe, projetado.

[LEDE]
Tudo o que você precisa saber, em uma única tabela.

[TABELA — dl semântico]
```

## Conteúdo da tabela

| Chave (dt) | Valor (dd) |
|------------|-----------|
| Movimento | Quartzo Orient japonês |
| Precisão | ±20 segundos / mês |
| Caixa | Aço inoxidável 316L escovado |
| Diâmetro | 42 mm |
| Espessura | 11 mm |
| Cristal | Mineral endurecido |
| Resistência | 5 ATM (50 m) |
| Pulseira | Silicone hipoalergênico perfurado |
| Bateria | 3 anos de autonomia |
| Calendário | Data automática |
| Garantia | 1 ano internacional Orient |

## Notas de execução

**HTML semântico obrigatório** — use `<dl>`, `<dt>`, `<dd>`, não table:

```html
<dl class="specs-table">
  <div class="specs-row">
    <dt class="specs-key">Movimento</dt>
    <dd class="specs-value">Quartzo Orient japonês</dd>
  </div>
  <!-- ... -->
</dl>
```

**CSS:** grid de 2 colunas dentro de cada `.specs-row`, border-top e border-bottom para separação visual.

**Container:** `max-width: 720px`, centralizado. Padding vertical generoso.

## Sem mídia gerada

100% tipografia funcional. É pausa técnica antes do social proof.
