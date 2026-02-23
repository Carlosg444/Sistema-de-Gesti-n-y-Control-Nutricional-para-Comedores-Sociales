import { Cse } from "./Cse";
import { Persona } from "./Persona";

export class Beneficiario extends Persona{
    private cse: Cse; 
    private conadis: boolean;
    constructor (id: number, nombre: string, dni: string, cse: Cse, conadis: boolean){
        if (cse==Cse.NoPobre || conadis==false){
            throw new Error ("Esta persona no puede ser beneficiada.")
        }
    
        super (id, nombre, dni);
        this.cse= cse;
        this.conadis= conadis;
    }
    
}