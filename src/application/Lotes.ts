import { LoteAlimento } from "../domain/LoteAlimento";
import { CuentaBancaria } from "../domain/CuentaBancaria";
import { Almacen } from "./Almacen";
export class Lotes{
    constructor(
        private lotesdonados: LoteAlimento[],
        private lotescomprados: LoteAlimento[],
        private almacen: Almacen
    ){};
    public agregarLoteDonado(lote: LoteAlimento): void{
        this.lotesdonados.push(lote);
    }
    public getLotesDonados(): LoteAlimento[]{
        return this.lotesdonados;
    }
    public getLotesComprados(): LoteAlimento[]{
        return this.lotescomprados;
    }
    public comprarLote(lote: LoteAlimento, cuentaBancaria: CuentaBancaria): void{
        if (cuentaBancaria.getSaldo()>=lote.getPrecioTotal()){
            cuentaBancaria.retirar(lote.getPrecioTotal());
            this.lotescomprados.push(lote);
        }else{
            throw new Error("Saldo insuficiente");
        }
    }
    public llevarAlmacen(lote: LoteAlimento): void{
        this.almacen.agregarLote(lote);
    }
}