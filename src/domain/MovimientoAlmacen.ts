import { LoteAlimento } from "./LoteAlimento";
import { TipoMovimiento } from "./TipoMovimiento";
export class MovimientoAlmacen{
    private fecha: Date;
    private tipo: TipoMovimiento;
    private lote: LoteAlimento;
    private cantidad: number;
    constructor (fecha: Date, tipo: TipoMovimiento, lote: LoteAlimento, cantidad: number){
        this.fecha= new Date();
        this.tipo= tipo;
        this.lote= lote;
        this.cantidad= cantidad;    
    }
    public getTipo(): TipoMovimiento{
        return this.tipo;
    }
    public getCantidad(): number{
        return this.cantidad;
    }
    public getLote(): LoteAlimento{
        return this.lote;
    }
    public getFecha(): Date{
        return this.fecha;
    }
}
