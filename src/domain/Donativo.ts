import { CuentaEmpresa } from "./CuentaEmpresa";

export class Donativo {
    private fecha: Date;

    constructor(
        private nombreDonante: string,
        private monto: number
    ) {
        if (!nombreDonante || nombreDonante.trim() === "") {
            throw new Error("El nombre del donante no puede estar vacío");
        }
        if (monto <= 0) {
            throw new Error("El monto del donativo debe ser mayor a 0");
        }
        this.fecha = new Date();
        CuentaEmpresa.getInstance().depositar(monto);
    }

    public getNombreDonante(): string {
        return this.nombreDonante;
    }

    public getMonto(): number {
        return this.monto;
    }

    public getFecha(): Date {
        return this.fecha;
    }

    public toString(): string {
        return `Donativo de S/ ${this.monto.toFixed(2)} por ${this.nombreDonante} el ${this.fecha.toLocaleDateString("es-PE")}`;
    }
}
