class Documento {
  constructor(titulo) {
    this.titulo = titulo;
    this.conteudo = '';
    this._historico = [];
  }

  editar(novoConteudo) {
    this._historico.push(this.conteudo);
    this.conteudo = novoConteudo;
  }

  desfazer() {
    if (this._historico.length === 0) {
      console.log('Nada para desfazer.');
      return;
    }
    this.conteudo = this._historico.pop();
  }

  exibir() {
    console.log(`[${this.titulo}] Conteúdo atual: ${this.conteudo}`);
  }
}

const doc = new Documento('Relatório');
doc.editar('Primeira versão do texto.');
doc.editar('Segunda versão.');
doc.editar('Terceira versão.');
doc.desfazer();
doc.desfazer();
doc.exibir();