import { Alimento } from "./alimento";
export class CategoriaAlimento{
    private categoria: string;
    private alimentos: Alimento[]= [];
    constructor (categoria: string){
        this.categoria=categoria;
    } 
    public agregarAlimentos(a: Alimento): void{
        this.alimentos.push(a);
    }
    public mostrarAlimentos(): void{
        this.alimentos.forEach(a=> a.mostrarAlimento());
    }
}
