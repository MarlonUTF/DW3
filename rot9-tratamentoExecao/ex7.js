class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

function validarAluno(aluno) {
  const erros = [];

  if (!aluno.nome) {
    erros.push("Nome é obrigatório");
  }

  if (!aluno.email || !aluno.email.includes("@")) {
    erros.push("Email inválido");
  }

  if (
    typeof aluno.idade !== "number" ||
    aluno.idade < 16
  ) {
    erros.push("Idade deve ser maior ou igual a 16");
  }

  if (erros.length > 0) {
    throw new ValidationError(
      "Erro de validação",
      erros
    );
  }

  return true;
}

try {
  validarAluno({
    nome: "",
    email: "emailinvalido",
    idade: 14,
  });
} catch (erro) {
  if (erro instanceof ValidationError) {
    console.log(erro.message);
    console.log("Detalhes:");
    console.log(erro.details);
  }
}