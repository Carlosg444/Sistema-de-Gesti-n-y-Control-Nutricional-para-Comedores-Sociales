import { LoteAlimento } from "./LoteAlimento";
import { TipoMovimiento } from "./TipoMovimiento";
export class MovimientoAlmacen {

    constructor (
        private fecha: Date,
        private tipo: TipoMovimiento,
        private cantidad: number,
        private lote: LoteAlimento
    ){
        this.fecha= new Date();
    }
    public getTipo(): TipoMovimiento{
        return this.tipo;
    }
    public getCantidad(): number{
        return this.cantidad;
    }
    public getFecha(): Date{
        return this.fecha;
    }
    public realizarMovimiento(): void{
        if (this.tipo==TipoMovimiento.Entrada){
            this.lote.aumentarStock(this.cantidad);
        }else {
        const exito = this.lote.disminuirStock(this.cantidad);
        if (!exito) {
            throw new Error("Stock insuficiente para realizar la salida");
            }
        }
    }
}