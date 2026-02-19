export class Alimento{
    private nombre: string;
    private fechaCaducidad: string;
    constructor (nombre:string, fechaCaducidad: string){
        this.nombre= nombre;
        this.fechaCaducidad= fechaCaducidad;
    }
    public mostrarAlimento(): void{
        console.log(this.nombre);
    }
    public mostrarCaducidad(): void{
        console.log(this.fechaCaducidad);
    }
}

