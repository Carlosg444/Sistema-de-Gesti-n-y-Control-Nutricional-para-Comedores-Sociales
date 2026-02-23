import { Persona } from "./Persona";
import { RolUsuario } from "./RolUsuario";
export class Usuario extends Persona{
    private rol: RolUsuario;
    constructor(id: number, nombre: string, dni: string, rol: RolUsuario) {
        super(id, nombre, dni);
        this.rol = rol;
    }
    public getRol(): RolUsuario {
        return this.rol;
    }
}