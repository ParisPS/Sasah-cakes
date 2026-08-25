# Princípios de Motion — Sasah Cakes

Especificação da Fase 7. Documentado antes de implementar — as issues de
implementação desta fase seguem estes valores em vez de decidir
duração/easing caso a caso.

Repositório de referência mencionado no contexto do projeto
(`kylezantos/design-principles`) foi checado e não existe (404) — este
documento segue só as diretrizes abaixo.

## Filosofia

Reforçar a identidade "artesanal, acolhedor, caseiro" do
[`style-guide.md`](style-guide.md), não a contradizer. Motion aqui é
**sutil e quase imperceptível** — o objetivo é suavizar transições de
estado (menu abrindo, seção aparecendo, imagem carregando), nunca chamar
atenção para si mesmo. Se uma animação faz o site parecer um produto de
tecnologia genérico, ela está errada para este projeto.

## Ferramenta: CSS puro, não Framer Motion

Framer Motion adiciona ~30-50kB (gzip) ao bundle do client e facilita
orquestração de animações complexas (sequências, gestures, layout
animations). Nada do que este projeto precisa — fade-in, slide sutil,
toggle de menu, skeleton pulsante — exige essa orquestração: são todos
alcançáveis com **transições/keyframes CSS** (via utilities do Tailwind)
mais **`IntersectionObserver`** nativo do navegador para detectar entrada
na viewport durante o scroll.

Para um site institucional pequeno e de baixo tráfego (mesmo raciocínio
de proporcionalidade das Fases 5 e 6), adicionar uma dependência de ~30kB
para animações desse porte não se paga. CSS puro é mais leve, não
adiciona re-renders de uma lib de animação, e o navegador já otimiza
transições CSS nativamente (composição na GPU).

## Durações

| Uso                                                     | Duração | Classe Tailwind                               |
| ------------------------------------------------------- | ------- | --------------------------------------------- |
| Micro-interação (hover, tap/active)                     | 200ms   | `duration-200`                                |
| Toggle (menu mobile abrindo/fechando)                   | 300ms   | `duration-300`                                |
| Entrada de seção ao rolar a página (fade-in + slide-up) | 500ms   | `duration-500`                                |
| Pulso do skeleton (loop contínuo)                       | ~1.6s   | `animate-pulse` (Tailwind, já usa esse valor) |

Slide-up de entrada usa deslocamento inicial de **12px** (dentro da faixa
sugerida de 8–16px) — perceptível o suficiente para registrar como
movimento, sutil o suficiente para não parecer um efeito "chamativo".

## Easing

- **Entradas** (fade-in, slide-up de seção) — `ease-out`
  (`cubic-bezier(0, 0, 0.2, 1)`, token padrão do Tailwind). Começa rápido,
  desacelera no final — sensação de "assentar no lugar", natural para algo
  que está aparecendo.
- **Interações** (hover, tap/active, toggle de menu) — `ease-in-out`
  (`cubic-bezier(0.4, 0, 0.2, 1)`, token padrão do Tailwind). Suave nos
  dois sentidos — apropriado para algo que pode reverter (hover sai,
  menu fecha).

Nenhuma curva de easing customizada — os tokens padrão do Tailwind já
cobrem os dois casos.

## Quando NÃO animar

- **Conteúdo do cardápio (preços, tamanhos, sabores)** — o objetivo ali é
  ler informação rápido, não admirar uma transição. Sem fade/slide nos
  `ProductCard` além do active/tap já existente (Fase 3).
- **Troca de rota inteira** — sem page transitions elaboradas entre
  páginas. `loading.tsx` (quando fizer sentido) é suficiente como
  feedback de progresso.
- **Parallax, animações em cascata (stagger) longas, ou qualquer motion
  que dependa de JS pesado** — fora de escopo desta fase, e
  provavelmente fora de escopo permanentemente para um site deste porte.
- **Sempre que `prefers-reduced-motion: reduce` estiver ativo** — todas as
  animações desta fase usam o variant `motion-reduce:`/`motion-safe:` do
  Tailwind (mapeiam direto para a media query
  `prefers-reduced-motion`), garantindo transição instantânea (ou
  drasticamente reduzida) para quem ativou essa preferência no sistema.
  Isso é tratado issue a issue durante a implementação, não como um
  retrofit — e auditado de ponta a ponta ao final da fase.

## Referência rápida (para copiar/colar durante a implementação)

```
// Entrada de seção ao rolar
"opacity-0 translate-y-3 transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none"
// + classe aplicada via IntersectionObserver quando entra na viewport:
"opacity-100 translate-y-0"

// Hover/tap (já em uso desde a Fase 3, para referência)
"transition-[box-shadow,transform] duration-200 ease-in-out motion-reduce:transition-none"
```
