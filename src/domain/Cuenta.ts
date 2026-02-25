export class Cuenta {
    private saldo: number;
    constructor(saldoInicial: number = 0) {
        this.saldo = saldoInicial;
    }
    public getSaldo(): number {
        return this.saldo;
    }
    public depositar(monto: number): void {
        if (monto <= 0) {
            throw new Error("Monto inválido");
        }
        this.saldo += monto;
    }
    public retirar(monto: number): void {
        if (monto > this.saldo) {
            throw new Error("Fondos insuficientes");
        }
        this.saldo -= monto;
    }
}