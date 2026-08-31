# Backlog de segurança

Este documento registra gaps de postura de segurança identificados numa
revisão, mas ainda não endereçados. É uma pendência conhecida — nenhum
destes itens foi implementado. Quando um deles for retomado, deve virar
uma Issue própria seguindo o fluxo normal de
[`docs/PROJECT_GUIDELINES.md`](PROJECT_GUIDELINES.md).

## 1. Cabeçalhos de segurança HTTP ausentes

**Gap:** o site não define explicitamente `Content-Security-Policy`,
`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` nem
`Permissions-Policy`. A Vercel aplica HTTPS e HSTS automaticamente em
todo deploy, mas esses cabeçalhos adicionais não fazem parte desse
comportamento padrão — precisam ser configurados explicitamente pelo
projeto.

**Por que importa:** `Content-Security-Policy` e `X-Frame-Options`
mitigam classes inteiras de ataque (XSS via injeção de script/recursos
externos não confiáveis, e clickjacking via `<iframe>` de terceiros
embutindo o site). `X-Content-Type-Options: nosniff` evita que o
navegador reinterprete o tipo de um arquivo servido de forma diferente
do declarado. `Referrer-Policy` controla quanta informação de URL
vaza para sites de destino ao seguir um link. `Permissions-Policy`
restringe o acesso a APIs sensíveis do navegador (câmera, microfone,
geolocalização) que o site não usa.

**Esforço estimado:** baixo — é configuração, não infraestrutura nova.
Os cabeçalhos podem ser adicionados via a chave `headers()` em
`next.config.ts`.

## 2. Sem auditoria de dependências

**Gap:** não existe nenhum processo automatizado (`npm audit` em CI, ou
Dependabot) alertando sobre vulnerabilidades conhecidas em pacotes do
projeto conforme elas são descobertas ao longo do tempo.

**Por que importa:** dependências de terceiros acumulam CVEs depois de
já estarem instaladas — sem um processo recorrente, uma vulnerabilidade
conhecida pode passar despercebida indefinidamente, mesmo que o código
do próprio projeto nunca tenha mudado.

**Esforço estimado:** baixo — configuração de uma ferramenta já
disponível na plataforma (Dependabot no GitHub) ou um passo adicional
no workflow de CI (`npm audit`), sem infraestrutura nova.

## 3. Encoding do formulário de pedido não auditado explicitamente

**Gap:** o formulário de pedido (Fase 8) monta um link `wa.me` a partir
dos dados preenchidos — nome, observações e demais campos de texto
livre. O link funciona corretamente nos testes existentes (unitários e
E2E), mas não houve uma verificação dedicada, cobrindo especificamente
casos de borda de caracteres especiais (acentuação, emoji, `&`, `#`,
quebras de linha, etc.), confirmando o uso correto de
`encodeURIComponent` (ou equivalente) em todo texto livre que compõe a
URL.

**Por que importa:** montar uma URL concatenando texto livre sem
encoding correto pode gerar um link malformado (campos cortados ou
corrompidos por caracteres reservados de URL) ou, em cenários mais
graves de manipulação de URL, abrir espaço para injeção de conteúdo
não esperado no destino do link.

**Esforço estimado:** baixo — é uma verificação/auditoria de código já
existente (`lib/pedido.ts` e afins), não uma reescrita.
