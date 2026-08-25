// Fallback global de carregamento entre rotas (Next.js App Router). Fica
// no nível raiz, então vira a UI de loading de qualquer navegação entre
// páginas — o Next.js envolve só o conteúdo da página (não o layout) num
// Suspense boundary, então Header/Footer/WhatsAppButton continuam de pé
// durante a transição, igual ao comportamento de error.tsx.
//
// Auditoria (Issue #61): todas as páginas do site são estáticas
// (prerenderizadas no build — ver `npm run build`), e o Next.js já
// pré-busca o conteúdo de cada <Link> visível na tela. Na prática, isso
// significa que este componente quase nunca chega a renderizar — só
// aparece se a navegação não foi pré-buscada (conexão lenta, prefetch
// desabilitado, digitação direta da URL). Por isso não há loading.tsx
// por página individual: não existe nada assíncrono específico de cada
// rota que justifique um esqueleto próprio — um fallback genérico já
// cobre o caso raro em que isso é necessário.
export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div
        role="status"
        aria-label="Carregando"
        className="border-sage-300 border-t-sage-500 h-10 w-10 animate-spin rounded-full border-4 motion-reduce:animate-none"
      />
    </main>
  );
}
