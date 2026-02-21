import { Alimento } from "./Alimento";
export class LoteAlimento{
    private cantidad: number;
    private fechaIngreso: Date;
    protected fechaCaducidad: Date;
    private numeroLote: number;
    private alimento: Alimento;
    constructor (cantidad: number, fechaIngreso: Date, fechaCaducidad: Date, numeroLote: number, alimento:Alimento){
        if (numeroLote <= 0) {
            throw new Error("El número de lote debe ser mayor que 0");
        }
        if (cantidad<0){
            throw new Error("La cantidad no puede ser negativa");
        }
        if (fechaCaducidad<=fechaIngreso){
            throw new Error ("La fecha de caducidad debe ser posterior a la fecha de ingreso");
        }
        this.cantidad= cantidad;
        this.fechaIngreso= fechaIngreso;
        this.fechaCaducidad= fechaCaducidad;
        this.numeroLote= numeroLote;
        this.alimento= alimento;
    }
    public getCantidad(): number{
        return this.cantidad;
    }
    public getNumeroDeLote(): number{
        return this.numeroLote;
    }
    public getFechaCaducidad(): Date{
        return this.fechaCaducidad;
    }
    public getAlimento(): Alimento{
        return this.alimento;
    }
    public aumentarCantidad(n: number): boolean{
        if (n>0){
            this.cantidad+=n;
            return true;
        }else return false;
    }
    public disminuirCantidad(n: number): boolean{
        if (this.cantidad>=n && n>0){
            this.cantidad-=n;
            return true;
        } else return false;
    }
}
