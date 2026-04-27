export default class ProdutoModel {
  #produtos;
  #proximoId;

  constructor() {
    this.#produtos = [
      { id: 1, nome: 'Notebook', preco: 3500 },
      { id: 2, nome: 'Mouse', preco: 80 },
      { id: 3, nome: 'Teclado', preco: 200 }
    ];
    this.#proximoId = 4;
  }

  async findAll() {
    return this.#produtos;
  }

  async findById(id) {
    return this.#produtos.find(p => p.id === id);
  }

  async create(dados) {
    const novo = {
      id: this.#proximoId++,
      nome: dados.nome,
      preco: dados.preco
    };
    this.#produtos.push(novo);
    return novo;
  }

  async delete(id) {
    const indice = this.#produtos.findIndex(p => p.id === id);
    if (indice === -1) return false;
    this.#produtos.splice(indice, 1);
    return true;
  }
}