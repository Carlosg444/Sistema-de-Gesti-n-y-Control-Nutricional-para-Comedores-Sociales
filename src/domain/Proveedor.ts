
import { RolUsuario } from "./RolUsuario";
import { Usuario } from "./Usuario";
import { TipoRelacion } from "./TipoRelacion";
import {LoteAlimento} from "./LoteAlimento";
import { CuentaBancaria } from "./CuentaBancaria";
export class Proveedor extends Usuario{
    constructor (
        nombre: string,
        dni: string,
        rol: RolUsuario,
        contrasena: string,
        private tipoRel: TipoRelacion,
        private listaLotes: LoteAlimento[],
        private cuentaBancaria: CuentaBancaria
    ){
        if (listaLotes==null){
            throw new Error("La lista de lotes no puede ser nula");
        }
        if (cuentaBancaria==null){
            throw new Error("La cuenta bancaria no puede ser nula");
        }
        super (nombre, dni, rol, contrasena);
    }
    public lotesDisponibles(): LoteAlimento[]{
        return this.listaLotes;
    }
    public agregarLote(lote: LoteAlimento): void{
        if (lote==null){
            throw new Error("El lote no puede ser nulo");
        }
        this.listaLotes.push(lote);
    }
    public eliminarLote(lote: LoteAlimento): void{
        if (lote==null){
            throw new Error("El lote no puede ser nulo");
        }
        this.listaLotes.splice(this.listaLotes.indexOf(lote), 1);
    }
    public getTipoRel(): TipoRelacion{
        return this.tipoRel;
    }
    public getCuentaBancaria(): CuentaBancaria{
        return this.cuentaBancaria;
    }
    public donarLote(lote: LoteAlimento): LoteAlimento {
    for (let i = 0; i < this.listaLotes.length; i++) {
        if (this.listaLotes[i] == lote) {
            this.listaLotes.splice(i, 1);
            return lote; 
        }
    }
    throw new Error("El lote no se encuentra en la lista");
}
    public venderLote(lote: LoteAlimento): LoteAlimento{
        for (let i=0; i<this.listaLotes.length; i++){
            if (this.listaLotes[i]==lote){
                this.listaLotes.splice(i, 1);
                return lote;
            }
        }
        throw new Error("El lote no se encuentra en la lista");
    }
}