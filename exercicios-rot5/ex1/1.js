class ContaBancaria {
  constructor(titular, saldo) {
    this.titular = titular;
    this.saldo = saldo;
  }

  depositar(valor) {
    this.saldo += valor;
  }

  sacar(valor) {
    if (valor > this.saldo) {
      console.log('Saldo insuficiente.');
      return;
    }
    this.saldo -= valor;
  }

  exibirSaldo() {
    console.log(`Titular: ${this.titular} | Saldo: R$ ${this.saldo.toFixed(2)}`);
  }
}

const conta1 = new ContaBancaria('Ana', 200);
conta1.sacar(50);
conta1.exibirSaldo();

const conta2 = new ContaBancaria('Carlos', 100);
conta2.depositar(20);
conta2.sacar(40);
conta2.exibirSaldo();