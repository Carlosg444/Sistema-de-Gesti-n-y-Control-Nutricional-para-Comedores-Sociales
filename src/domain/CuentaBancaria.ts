export class CuentaBancaria{
    constructor(
        private numeroCuenta: string,
        private saldo: number
    ){
        if (numeroCuenta==null){
            throw new Error("El número de cuenta no puede ser nulo");
        }
        if (saldo<0){
            throw new Error("El saldo no puede ser negativo");
        }
    }
    public getNumeroCuenta(): string{
        return this.numeroCuenta;
    }
    public getSaldo(): number{
        return this.saldo;
    }
    public setNumeroCuenta(numeroCuenta: string): void{
        if (numeroCuenta==null){
            throw new Error("El número de cuenta no puede ser nulo");
        }
        this.numeroCuenta= numeroCuenta;
    }
    public setSaldo(saldo: number): void{
        if (saldo<0){
            throw new Error("El saldo no puede ser negativo");
        }
        this.saldo= saldo;
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