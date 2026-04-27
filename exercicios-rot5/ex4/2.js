class Livro {
  constructor(titulo, autor) {
    this.titulo = titulo;
    this.autor = autor;
    this.disponivel = true;
  }

  emprestar() {
    if (!this.disponivel) {
      console.log('Livro indisponível.');
      return;
    }
    this.disponivel = false;
  }

  devolver() {
    this.disponivel = true;
  }

  exibir() {
    const situacao = this.disponivel ? 'Disponível' : 'Indisponível';
    console.log(`${this.titulo} — ${this.autor} — ${situacao}`);
  }
}

class Biblioteca {
  constructor(nome) {
    this.nome = nome;
    this.acervo = [];
  }

  adicionar(livro) {
    this.acervo.push(livro);
  }

  buscar(titulo) {
    return this.acervo.find(l => l.titulo === titulo) || null;
  }

  emprestar(titulo) {
    const livro = this.buscar(titulo);
    if (!livro) {
      console.log('Livro não encontrado.');
      return;
    }
    livro.emprestar();
  }

  devolver(titulo) {
    const livro = this.buscar(titulo);
    if (livro) livro.devolver();
  }

  exibirAcervo() {
    this.acervo.forEach(livro => livro.exibir());
  }
}

const biblioteca = new Biblioteca('Central');
biblioteca.adicionar(new Livro('O Alquimista', 'Paulo Coelho'));
biblioteca.adicionar(new Livro('Dom Casmurro', 'Machado de Assis'));
biblioteca.adicionar(new Livro('1984', 'George Orwell'));
biblioteca.emprestar('Dom Casmurro');
biblioteca.emprestar('1984');
biblioteca.devolver('1984');
biblioteca.exibirAcervo();