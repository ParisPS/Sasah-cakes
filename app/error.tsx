"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

// Error boundary do Next.js App Router — captura erros não tratados
// dentro de qualquer página/segmento e mostra essa tela em vez da tela
// técnica genérica do Next.js. Header/Footer/WhatsAppButton do layout
// raiz continuam renderizados normalmente (só o conteúdo da página é
// substituído). Ver docs/OBSERVABILITY.md.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="bg-cream-500 flex min-h-[60vh] items-center justify-center px-4 py-24 text-center">
      <div className="max-w-md rounded-lg bg-white p-10 shadow-md">
        <h1 className="text-sage-900">Ops, algo deu errado</h1>
        <p className="text-ink-600 mt-4">
          Não foi possível carregar esta página. Nosso time já foi avisado —
          tente novamente em instantes.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-pill bg-sage-500 font-body text-cream-300 active:bg-sage-700 md:hover:bg-sage-700 px-7 py-3 shadow-sm transition-[box-shadow,transform] active:scale-[0.98] active:shadow-md motion-reduce:transition-none md:hover:shadow-md"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="rounded-pill border-sage-500 font-body text-sage-700 active:bg-sage-100 md:hover:bg-sage-100 border px-7 py-3"
          >
            Voltar para a Home
          </Link>
        </div>
        {error.digest && (
          <p className="caption mt-6">Código de referência: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
