# Histórico de decisões

## 2026-06-26
- Adotado Vertical Slice (padrão de aula).
- Chaveamento implementado com campos origem_* na tabela jogos.
- Tabela palpites inclui bolao_id para ranking por bolão.

## 2026-06-27
- Adicionada fase "Dezesseis avos" ao ENUM fase_jogo (Copa 2026 tem 48 seleções).
- CHECK constraints permitem posições 1,2 (e futuramente 3 para 16 avos).

## 2026-06-28
- Tabelas alimentadas pela ESPN (grupos, paises, jogos) terão apenas GET na API.
- Resultados terão POST para lançamento e cálculo automático de pontos.
- Estrutura de documentação para IA (pasta ai/) criada.