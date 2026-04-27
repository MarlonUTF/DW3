class Aluno {
  constructor(nome) {
    this.nome = nome;
    this.notas = [];
  }

  adicionarNota(nota) {
    this.notas.push(nota);
  }

  calcularMedia() {
    if (this.notas.length === 0) return 0;
    const soma = this.notas.reduce((acc, n) => acc + n, 0);
    return soma / this.notas.length;
  }

  situacao() {
    return this.calcularMedia() >= 6 ? 'Aprovado' : 'Reprovado';
  }

  exibir() {
    console.log(
      `${this.nome} | Média: ${this.calcularMedia().toFixed(2)} | ${this.situacao()}`
    );
  }
}

const aluno = new Aluno('Ana');
aluno.adicionarNota(8);
aluno.adicionarNota(7);
aluno.adicionarNota(7.5);
aluno.exibir();