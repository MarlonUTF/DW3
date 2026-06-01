function criarProduto(dados) {
  if (!dados.nome) {
    throw new Error("Nome é obrigatório");
  }

  if (typeof dados.preco !== "number" || dados.preco <= 0) {
    throw new Error("Preço deve ser maior que zero");
  }

  if (
    typeof dados.estoque !== "number" ||
    !Number.isInteger(dados.estoque) ||
    dados.estoque < 0
  ) {
    throw new Error("Estoque deve ser um número inteiro maior ou igual a zero");
  }

  return {
    nome: dados.nome,
    preco: dados.preco,
    estoque: dados.estoque,
  };
}

try {
  const produto = criarProduto({
    nome: "Mouse",
    preco: 100,
    estoque: 5,
  });

  console.log(produto);
} catch (erro) {
  console.log(erro.message);
}