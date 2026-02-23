export abstract class Persona {
    protected id: number;
    protected nombre: string;
    protected dni: string;
    constructor(id: number, nombre: string, dni: string) {
        this.id = id;
        this.nombre = nombre;
        this.dni = dni;
    }
    public getNombre(): string {
        return this.nombre;
    }
    public getDni(): string {
        return this.dni;
    }
}