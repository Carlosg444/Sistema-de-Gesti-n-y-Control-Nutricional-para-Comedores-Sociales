import { LoteAlimento } from "./LoteAlimento";
export class Almacen{
    private lotes: LoteAlimento[]=[];
    public agregarLote(l: LoteAlimento): void{
        this.lotes.push(l);
    }
    public getLotes(): LoteAlimento[] {
        return this.lotes;
    }
    public disminuirLote (nl: number, n: number): boolean{
        for (let l of this.lotes){
            if (l.getNumeroDeLote()==nl){
               return l.disminuirCantidad(n);
            }
        }
        return false;
    }
}
