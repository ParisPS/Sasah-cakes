# Padrão de Fluxo de Trabalho — Sasah Cakes

Este documento é a referência oficial do fluxo de trabalho do projeto.
Todo agente/modelo (humano ou IA) deve consultá-lo antes de abrir Issues
ou Pull Requests.

## Regras

1. **Toda tarefa vira uma Issue antes de ser trabalhada.**
   Correção, Melhoria ou Nova Função — qualquer trabalho no repositório
   começa com uma Issue no GitHub descrevendo o que será feito e por quê.

2. **Todo trabalho é feito via Pull Request.**
   Nunca commitar diretamente na branch principal (`main`). Criar uma
   branch a partir da Issue, implementar a mudança nela, e abrir um PR
   para `main`.

3. **Todo PR menciona a Issue relacionada.**
   A descrição do PR deve referenciar a Issue que resolve, usando a
   sintaxe do GitHub (ex: `Closes #12`), para que o merge feche a Issue
   automaticamente.

4. **Este arquivo é a fonte da verdade do processo.**
   Qualquer agente que for abrir uma Issue ou PR neste repositório deve
   seguir o que está descrito aqui.

## Fluxo resumido

```
Issue → branch → commits → Pull Request (Closes #N) → merge em main
```
