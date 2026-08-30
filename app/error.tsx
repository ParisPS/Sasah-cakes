"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/Button";

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
        <h1 className="text-sage-900 dark:text-sage-100">
          Ops, algo deu errado
        </h1>
        <p className="text-ink-600 mt-4">
          Não foi possível carregar esta página. Nosso time já foi avisado —
          tente novamente em instantes.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="primary" onClick={() => reset()}>
            Tentar novamente
          </Button>
          <Button variant="secondary" href="/">
            Voltar para a Home
          </Button>
        </div>
        {error.digest && (
          <p className="caption mt-6">Código de referência: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
