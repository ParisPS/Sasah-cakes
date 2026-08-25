"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// global-error.tsx só é usado quando o próprio layout raiz (app/layout.tsx)
// falha — nesse caso ele substitui TODO o <html>, então precisa ser
// autossuficiente: sem depender de globals.css/Tailwind, das fontes do
// Google Fonts ou de outros componentes do layout (Header, etc.), que
// podem ter sido a causa da falha. Por isso usa estilo inline com as
// cores da marca direto em hex, em vez das classes utilitárias. Ver
// docs/OBSERVABILITY.md.
export default function GlobalError({
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
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          backgroundColor: "#F5EFDF",
          color: "#2E2A20",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: 420,
              backgroundColor: "#FFFFFF",
              borderRadius: 28,
              padding: 40,
              boxShadow: "0 16px 32px rgba(63, 74, 46, 0.18)",
            }}
          >
            <h1 style={{ color: "#3F4A2E", fontSize: 28, margin: 0 }}>
              Ops, algo deu errado
            </h1>
            <p style={{ color: "#6B6455", marginTop: 16, lineHeight: 1.6 }}>
              O site encontrou um problema inesperado. Nosso time já foi avisado
              — tente novamente em instantes.
            </p>
            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  borderRadius: 9999,
                  backgroundColor: "#7C8A5E",
                  color: "#FBF7EC",
                  border: "none",
                  padding: "12px 28px",
                  fontFamily: "inherit",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Tentar novamente
              </button>
              {/* <a> proposital em vez de next/link: se o layout raiz
                  falhou a ponto de acionar este boundary, prefira um
                  reload completo de página a depender do client-side
                  router do App Router, que pode estar no mesmo estado
                  quebrado. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                style={{
                  borderRadius: 9999,
                  border: "1px solid #7C8A5E",
                  color: "#5C6B41",
                  padding: "12px 28px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Voltar para a Home
              </a>
            </div>
            {error.digest && (
              <p style={{ color: "#6B6455", fontSize: 13, marginTop: 24 }}>
                Código de referência: {error.digest}
              </p>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
