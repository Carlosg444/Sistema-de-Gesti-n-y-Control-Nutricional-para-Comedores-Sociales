import { Alimento } from "./alimento";
export class CategoriaAlimento {
    private nombre: string;
    private alimentos: Alimento[] = [];
    constructor(nombre: string) {
        this.nombre = nombre;
    }
    public agregarAlimento(a: Alimento): void {
        this.alimentos.push(a);
    }
    public getNombre(): string {
        return this.nombre;
    }
    public getAlimentos(): Alimento[] {
        return this.alimentos;
    }
}