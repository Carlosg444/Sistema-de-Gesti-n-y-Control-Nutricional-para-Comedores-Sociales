import { Cse } from "./Cse";
export class Beneficiario{
    constructor(
    private nombre: string,
    private dni: string,
    private numero: number,
    private edad: number,
    private id: string,
    private cse: Cse
    ){  
        if (edad<0) throw new Error ("Edad Invalida.");
        if (cse==Cse.NoPobre){
            throw new Error ("Esta persona no puede ser beneficiada.");
        }
    }
    
    public getNombre(): string {
        return this.nombre; 
    }
    public getDni(): string {
        return this.dni; 
    }
    public getEdad(): number {
        return this.edad; 
    }
    public getId(): string {
        return this.id; 
    }
    public getCse(): Cse {
        return this.cse; 
    }
}