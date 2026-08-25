// TEMPORÁRIO — Route Handler de validação da integração do Sentry
// (Issue #51). Removido antes do merge final. Ver docs/OBSERVABILITY.md.
export async function GET() {
  throw new Error(
    "[Fase 6] Erro de teste proposital — validação server (Route Handler)",
  );
}
