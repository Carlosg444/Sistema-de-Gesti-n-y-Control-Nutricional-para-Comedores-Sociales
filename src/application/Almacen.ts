import { LoteAlimento } from "../domain/LoteAlimento";
import { MovimientoAlmacen } from "../domain/MovimientoAlmacen";
export class Almacen{
    constructor(
        private lotes: LoteAlimento[],
        private movimientos: MovimientoAlmacen[]
    ){};
    public agregarLote(lote: LoteAlimento): void{
        this.lotes.push(lote);
    }
    public getLotes(): LoteAlimento[]{
        return this.lotes;
    }
    public getMovimientos(): MovimientoAlmacen[]{
        return this.movimientos;
    }
    public agregarMovimiento(movimiento: MovimientoAlmacen): void{
        this.movimientos.push(movimiento);
    }
}