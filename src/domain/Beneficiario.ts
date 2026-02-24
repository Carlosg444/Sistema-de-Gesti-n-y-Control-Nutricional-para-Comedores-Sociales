import { Cse } from "./Cse";
import { RolUsuario } from "./RolUsuario";
import { Usuario } from "./Usuario";
export class Beneficiario extends Usuario{
    constructor (
        nombre: string,
        dni: string,
        rol: RolUsuario,
        numero: number,
        private edad: number,
        private id: string,
        private cse: Cse
    ){  
        if (edad<0) throw new Error ("Edad Invalida.");
        if (cse==Cse.NoPobre){
            throw new Error ("Esta persona no puede ser beneficiada.");
        }
        super (nombre, dni, rol, numero);
    }
    

}