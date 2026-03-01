export class CuentaEmpresa {
    private static instancia: CuentaEmpresa;
    private saldo: number = 0;
    private readonly numeroCuenta: string = "00000000000000000001";

    private constructor() {}

    public static getInstance(): CuentaEmpresa {
        if (!CuentaEmpresa.instancia) {
            CuentaEmpresa.instancia = new CuentaEmpresa();
        }
        return CuentaEmpresa.instancia;
    }

    public getSaldo(): number {
        return this.saldo;
    }

    public getNumeroCuenta(): string {
        return this.numeroCuenta;
    }

    public depositar(monto: number): void {
        if (monto <= 0) throw new Error("El monto debe ser mayor a 0");
        this.saldo += monto;
    }

    public retirar(monto: number): void {
        if (monto <= 0) throw new Error("El monto debe ser mayor a 0");
        if (monto > this.saldo) throw new Error("Fondos insuficientes en la cuenta de la empresa");
        this.saldo -= monto;
    }
}
