# Seção 10 — FAQ

## Estrutura visual

- **Tema:** Light
- **Layout:** Container narrow, 6 perguntas empilhadas com border separadora
- **Função:** Antecipar objeções antes do CTA final

## Copy

```
[EYEBROW]
PERGUNTAS FREQUENTES

[HEADLINE]
Tudo o que você quer saber.

[FAQ LIST — 6 pares pergunta/resposta]
```

## As 6 perguntas

### 1.
**P:** Por que escolher Orient e não uma marca mais conhecida?

**R:** Orient é uma das maiores fabricantes japonesas de relógios — pertence ao mesmo grupo da Seiko. A diferença é que Orient não investe em marketing global, então você paga pela engenharia, não pela publicidade.

### 2.
**P:** O movimento é fabricado no Japão?

**R:** Sim. O movimento de quartzo é desenvolvido e calibrado nas fábricas da Orient no Japão.

### 3.
**P:** Posso nadar com ele?

**R:** Sim. Com 5 ATM de resistência (50 metros), você pode usar no banho, na piscina e em natação recreativa. Para mergulho profissional, recomendamos modelos específicos.

### 4.
**P:** A pulseira pode ser trocada?

**R:** Sim. A pulseira é padrão de 22mm e pode ser substituída por qualquer modelo compatível — couro, aço, nylon.

### 5.
**P:** Qual a garantia?

**R:** 1 ano de garantia internacional Orient cobrindo defeitos de fabricação. Suporte em rede autorizada no Brasil.

### 6.
**P:** Como é a precisão comparada a um smartwatch?

**R:** Diferente. Um smartwatch depende de bateria diária e atualizações. Este relógio mantém precisão de ±20 segundos por mês com 3 anos de autonomia. Você nunca tira do pulso.

## Notas de execução

**Estrutura HTML:**
```html
<div class="faq-list">
  <div class="faq-item">
    <p class="faq-question">Por que escolher Orient...?</p>
    <p class="faq-answer">Orient é uma das maiores...</p>
  </div>
  <!-- ... -->
</div>
```

**CSS:**
- Cada item com border-top de 1px
- Último item com border-bottom também
- Padding vertical 24px em cada item
- Pergunta em peso 500, resposta em peso 300 muted

**Não usar `<details>/<summary>` accordion aqui** — todas as respostas visíveis desde o começo. FAQ não precisa esconder informação; esconder cria fricção.

## Sem mídia gerada

100% tipografia.
