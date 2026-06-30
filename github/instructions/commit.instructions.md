# Instruções para o GitHub Copilot

## Idioma

Sempre responda em Português do Brasil.

## Mensagens de commit

Sempre utilize Conventional Commits com GitMoji.

Formato:

```text
<emoji> <tipo>(<escopo>): <resumo>

- Alteração realizada
- Alteração realizada
- Alteração realizada
```

### Tipos

| Emoji | Tipo |
|--------|------|
| ✨ | feat |
| 🐛 | fix |
| ♻️ | refactor |
| ⚡ | perf |
| 💄 | style |
| 📝 | docs |
| ✅ | test |
| 🔧 | chore |
| 🚀 | build |
| 🔥 | remove |
| 🔒 | security |
| 🌐 | i18n |
| 🗃️ | db |
| ♿ | a11y |

### Regras

- Escreva sempre em português.
- Utilize verbos no presente.
- O resumo deve possuir no máximo 72 caracteres.
- Explique as alterações em tópicos.
- Nunca utilize mensagens genéricas como "update", "changes", "misc", "ajustes".
- Sempre identifique corretamente o escopo.
- Priorize clareza e objetividade.

### Exemplo

```text
🐛 fix(waypoint): corrige estado do formulário ao cancelar edição

- Limpa parâmetros da URL
- Reseta formulário
- Remove ID em edição
```