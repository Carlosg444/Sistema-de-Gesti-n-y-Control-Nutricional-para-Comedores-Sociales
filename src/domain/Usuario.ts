import { RolUsuario } from "./RolUsuario";
export class Usuario{
    constructor(
    private nombre: string,
    private dni: string,
    private rol: RolUsuario,
    private contrasena: string
){}
    public getContrasena(): string { 
        return this.contrasena; 
    }
    public getDni(): string { 
        return this.dni; 
    }
    public getNombre(): string{
        return this. nombre;
    }
    public getRol(): RolUsuario {
        return this.rol;
    }
}