import { Usuario } from "./Usuario";
import { RolUsuario } from "./RolUsuario";
import { Almacen } from "../application/Almacen";
import { Lotes } from "../application/Lotes";
import { Beneficiario } from "./Beneficiario";

export class Responsable extends Usuario {
    constructor(
        nombre: string,
        dni: string,
        private almacen: Almacen,
        private lotes: Lotes,
        private beneficiarios: Beneficiario[]
    ){
        super(nombre, dni, RolUsuario.Responsable, "");
    }
    public getAlmacen(): Almacen { return this.almacen; }
    public getLotes(): Lotes { return this.lotes; }
    public getBeneficiarios(): Beneficiario[] { return this.beneficiarios; }
    public registrarBeneficiario(b: Beneficiario): void {
        this.beneficiarios.push(b);
    }
}