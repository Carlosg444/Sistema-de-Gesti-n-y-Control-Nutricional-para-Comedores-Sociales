import { RolUsuario } from "./RolUsuario";
export class Usuario{
    constructor (
        private nombre: string,
        private dni: string,
        private rol: RolUsuario,
        private numero: number
    ){}
    public getNombre(): string{
        return this. nombre;
    }
    public getRol(): RolUsuario {
        return this.rol;
    }
    public getNumero(): number{
        return this.numero;
    }
}