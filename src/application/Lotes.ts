import { LoteAlimento } from "../domain/LoteAlimento";
import { Almacen } from "./Almacen";
import { CuentaEmpresa } from "../domain/CuentaEmpresa";

export class Lotes {
    constructor(
        private lotesdonados: LoteAlimento[],
        private lotescomprados: LoteAlimento[],
        private almacen: Almacen
    ) {}

    public agregarLoteDonado(lote: LoteAlimento): void {
        this.lotesdonados.push(lote);
        this.almacen.agregarLote(lote);
    }

    public getLotesDonados(): LoteAlimento[] {
        return this.lotesdonados;
    }

    public getLotesComprados(): LoteAlimento[] {
        return this.lotescomprados;
    }

    public comprarLote(lote: LoteAlimento): void {
        const cuenta = CuentaEmpresa.getInstance();
        if (cuenta.getSaldo() >= lote.getPrecioTotal()) {
            cuenta.retirar(lote.getPrecioTotal());
            this.lotescomprados.push(lote);
            this.almacen.agregarLote(lote);
        } else {
            throw new Error(
                `Saldo insuficiente. Se necesitan S/ ${lote.getPrecioTotal().toFixed(2)} y la cuenta tiene S/ ${cuenta.getSaldo().toFixed(2)}`
            );
        }
    }

    public llevarAlmacen(lote: LoteAlimento): void {
        this.almacen.agregarLote(lote);
    }
}