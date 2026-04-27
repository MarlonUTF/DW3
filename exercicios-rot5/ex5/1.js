class Timer {
  constructor(nome) {
    this.nome = nome;
    this.segundos = 0;
  }

  iniciar() {
    setInterval(() => {
      this.segundos++;
      console.log(`${this.nome}: ${this.segundos}s`);
    }, 1000);
  }
}

const t = new Timer('Cronômetro');
t.iniciar();