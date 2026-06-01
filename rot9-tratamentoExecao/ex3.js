class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function criarProduto(dados) {
  if (!dados.nome) {
    throw new ValidationError("Nome é obrigatório");
  }

  if (typeof dados.preco !== "number" || dados.preco <= 0) {
    throw new ValidationError("Preço deve ser maior que zero");
  }

  if (
    typeof dados.estoque !== "number" ||
    !Number.isInteger(dados.estoque) ||
    dados.estoque < 0
  ) {
    throw new ValidationError(
      "Estoque deve ser um número inteiro maior ou igual a zero"
    );
  }

  return dados;
}

try {
  criarProduto({
    preco: 100,
    estoque: 5,
  });
} catch (erro) {
  if (erro instanceof ValidationError) {
    console.log(`Erro de validação: ${erro.message}`);
  } else {
    console.log("Erro inesperado");
  }
}