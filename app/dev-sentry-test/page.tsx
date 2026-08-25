"use client";

import { useState } from "react";

// TEMPORÁRIO — página de validação da integração do Sentry (Issue #51).
// Não linkada em nenhum menu/nav. Removida antes do merge final desta PR
// depois que a captura for confirmada no painel do Sentry. Ver
// docs/OBSERVABILITY.md.
export default function SentryTestPage() {
  const [throwRenderError, setThrowRenderError] = useState(false);
  const [serverStatus, setServerStatus] = useState<string | null>(null);

  if (throwRenderError) {
    throw new Error(
      "[Fase 6] Erro de teste proposital — validação client (error boundary)",
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-sage-900">Teste do Sentry</h1>
      <p className="text-ink-600 mt-4">
        Página temporária para validar a integração do Sentry (Issue #51).
        Remover antes do merge final.
      </p>
      <div className="mt-8 flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setThrowRenderError(true)}
          className="rounded-pill bg-sage-500 font-body text-cream-300 px-7 py-3"
        >
          Disparar erro no client (error boundary)
        </button>
        <button
          type="button"
          onClick={async () => {
            const res = await fetch("/api/sentry-test");
            setServerStatus(String(res.status));
          }}
          className="rounded-pill border-sage-500 font-body text-sage-700 border px-7 py-3"
        >
          Disparar erro no server (Route Handler)
        </button>
        {serverStatus && (
          <p className="caption">Resposta do server: {serverStatus}</p>
        )}
      </div>
    </main>
  );
}
