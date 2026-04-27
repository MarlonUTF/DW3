class Carrinho {
  constructor() {
    this.itens = [];
  }

  adicionar(nome, preco, quantidade) {
    this.itens.push({ nome, preco, quantidade });
  }

  remover(nome) {
    const indice = this.itens.findIndex(item => item.nome === nome);
    if (indice === -1) {
      console.log('Item não encontrado.');
      return;
    }
    this.itens.splice(indice, 1);
  }

  total() {
    return this.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  }

  exibir() {
    this.itens.forEach(item => {
      console.log(`${item.quantidade}x ${item.nome} — R$ ${(item.preco * item.quantidade).toFixed(2)}`);
    });
    console.log(`Total: R$ ${this.total().toFixed(2)}`);
  }
}

const carrinho = new Carrinho();
carrinho.adicionar('Arroz', 5, 2);
carrinho.adicionar('Sabão', 5.5, 1);
carrinho.adicionar('Feijão', 8, 1);
carrinho.remover('Feijão');
carrinho.exibir();