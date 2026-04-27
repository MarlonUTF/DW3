class Produto {
  constructor(nome, preco, estoque) {
    this.nome = nome;
    this.preco = preco;
    this.estoque = estoque;
  }

  disponivel() {
    return this.estoque > 0;
  }

  exibir() {
    const situacao = this.disponivel() ? 'Em estoque' : 'Fora de estoque';
    console.log(`${this.nome} — R$ ${this.preco.toFixed(2)} — ${situacao}`);
  }
}

const prod1 = new Produto('Notebook', 3500, 5);
const prod2 = new Produto('Fone de ouvido', 150, 0);
prod1.exibir();
prod2.exibir();