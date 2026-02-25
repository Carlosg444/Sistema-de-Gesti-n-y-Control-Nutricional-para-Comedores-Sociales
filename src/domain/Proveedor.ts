import { LoteAlimento } from "./LoteAlimento";
import { RolUsuario } from "./RolUsuario";
import { Usuario } from "./Usuario";
import { TipoProveedor } from "./TipoProveedor";
import { TipoRelacion } from "./TipoRelacion";
export class Proveedor extends Usuario{
    constructor (
        nombre: string,
        dni: string,
        rol: RolUsuario,
        numero: number,
        private tipoPro: TipoProveedor,
        private tipoRel: TipoRelacion,
        private direccion: string,

    ){
        if (rol !== RolUsuario.Proveedor) {
            throw new Error("El rol debe ser Proveedor");
        }
        super (nombre, dni, rol, numero);
    }
}