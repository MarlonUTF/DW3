# Regras de negócio - Bolões
- Criador deve existir (perfil válido).
- Participantes: N:N via participantes_bolao.
- Ao adicionar participante, verificar se perfil existe e não está já no bolão.
- Ranking: ordenar por pontuacao_total DESC.