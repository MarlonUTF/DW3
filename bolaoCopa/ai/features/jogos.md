# Regras de negócio - Jogos
- Times e data/hora obrigatórios.
- Não pode excluir jogo que já tem resultado (encerrado = true).
- GET /jogos/:id deve incluir resultado (LEFT JOIN).
- Chaveamento: ao lançar resultado, preencher pais_casa_id/pais_fora_id dos jogos seguintes com base em origem_*.
- Status: Implementado.
