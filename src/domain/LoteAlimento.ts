import { Alimento } from "./Alimento";
export class LoteAlimento{
    constructor (
            private stock: number,
            private fechaIngreso: Date,
            private fechaCaducidad: Date,
            private idLote: number,
            private alimento: Alimento,
            private precioUnitario: number
    ){
        if (idLote <= 0) {
            throw new Error("El número de lote debe ser mayor que 0");
        }
        if (stock<0){
            throw new Error("El stock no puede ser negativo");
        }
        if (fechaCaducidad<=fechaIngreso){
            throw new Error ("La fecha de caducidad debe ser posterior a la fecha de ingreso");
        }
        if (precioUnitario<0){
            throw new Error("El precio unitario no puede ser negativo");
        }
        this.stock= stock;
        this.fechaIngreso= fechaIngreso;
        this.fechaCaducidad= fechaCaducidad;
        this.idLote= idLote;
        this.alimento= alimento;
        this.precioUnitario= precioUnitario;
    }
    public getStock(): number{
        return this.stock;
    }
    public getIdLote(): number{
        return this.idLote;
    }
    public getFechaCaducidad(): Date{
        return this.fechaCaducidad;
    }
    public getAlimento(): Alimento{
        return this.alimento;
    }
    public getPrecioUnitario(): number{
        return this.precioUnitario;
    }
    public aumentarStock(n: number): boolean{
        if (n>0){
            this.stock+=n;
            return true;
        }else return false;
    }
    public disminuirStock(n: number): boolean{
        if (this.stock>=n && n>0){
            this.stock-=n;
            return true;
        } else return false;
    }
    public getPrecioTotal(): number{
        return this.stock*this.precioUnitario;
    }
     getFechaIngreso(): string {
        return this.fechaIngreso.toLocaleString("es-PE", { timeZone: "America/Lima" });
    }
    public setStock(stock: number): void{
        if (stock<0){
            throw new Error("El stock no puede ser negativo");
        }
        this.stock= stock;
    }
    public setFechaCaducidad(fechaCaducidad: Date): void{
        if (fechaCaducidad<=this.fechaIngreso){
            throw new Error ("La fecha de caducidad debe ser posterior a la fecha de ingreso");
        }
        this.fechaCaducidad= fechaCaducidad;
    }
    public setPrecioUnitario(precioUnitario: number): void{
        if (precioUnitario<0){
            throw new Error("El precio unitario no puede ser negativo");
        }
        this.precioUnitario= precioUnitario;
    }
    public setAlimento(alimento: Alimento): void{
        if (alimento==null){
            throw new Error("El alimento no puede ser nulo");
        }
        this.alimento= alimento;
    }
    public setFechaIngreso(fechaIngreso: Date): void{
        if (fechaIngreso==null){
            throw new Error("La fecha de ingreso no puede ser nula");
        }
        this.fechaIngreso= fechaIngreso;
    }
    public setIdLote(idLote: number): void{
        if (idLote<=0){
            throw new Error("El número de lote debe ser mayor que 0");
        }
        this.idLote= idLote;
    }
}
