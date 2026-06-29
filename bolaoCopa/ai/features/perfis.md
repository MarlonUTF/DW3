# Regras de negócio - Perfis
- nome é obrigatório (não pode ser vazio).
- CRUD completo (GET, POST, PATCH, DELETE).
- Ao deletar, os palpites e bolões do perfil são removidos em cascata (ON DELETE CASCADE no banco).