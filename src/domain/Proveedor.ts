
import { LoteAlimento } from "./LoteAlimento";
import { RolUsuario } from "./RolUsuario";
import { Usuario } from "./Usuario";
import { TipoProveedor } from "./TipoProveedor";
export class Proveedor extends Usuario{
    constructor (
        nombre: string,
        dni: string,
        rol: RolUsuario,
        numero: number,
        private tipo: TipoProveedor,
        private direccion: string
    ){
        super (nombre, dni, rol, numero);
    }
    public darLote (lote: LoteAlimento){
        return lote;
    }
}