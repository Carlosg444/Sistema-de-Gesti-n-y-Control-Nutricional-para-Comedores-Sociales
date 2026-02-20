import { CategoriaAlimento } from "./CategoriaAlimento";
export class Alimento{
    private nombre: string;
    private categoria: CategoriaAlimento;
    constructor (nombre:string, categoria: CategoriaAlimento){
        this.nombre= nombre;
        this.categoria = categoria;
    }
    public getNombre(): string {
        return this.nombre;
    }
    public getCategoria(): CategoriaAlimento {
        return this.categoria;
    }

}
