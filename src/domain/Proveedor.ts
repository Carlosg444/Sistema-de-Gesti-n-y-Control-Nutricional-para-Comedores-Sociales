import { RolUsuario } from "./RolUsuario";
import { Usuario } from "./Usuario";
import { LoteAlimento } from "./LoteAlimento";
import { CuentaBancaria } from "./CuentaBancaria";
import { Alerta } from "./Alerta";
import { Lotes } from "../application/Lotes";

export class Proveedor extends Usuario {
    constructor(
        nombre: string,
        dni: string,
        rol: RolUsuario,
        contrasena: string,
        private listaLotes: LoteAlimento[],
        private cuentaBancaria: CuentaBancaria
    ) {
        if (listaLotes == null) throw new Error("La lista de lotes no puede ser nula");
        if (cuentaBancaria == null) throw new Error("La cuenta bancaria no puede ser nula");
        super(nombre, dni, rol, contrasena);
    }

    public lotesDisponibles(): LoteAlimento[] {
        return this.listaLotes;
    }

    public agregarLote(lote: LoteAlimento): void {
        if (lote == null) throw new Error("El lote no puede ser nulo");
        this.listaLotes.push(lote);
    }

    public eliminarLote(lote: LoteAlimento): void {
        if (lote == null) throw new Error("El lote no puede ser nulo");
        this.listaLotes.splice(this.listaLotes.indexOf(lote), 1);
    }

    public getCuentaBancaria(): CuentaBancaria {
        return this.cuentaBancaria;
    }

    public donarLote(lote: LoteAlimento, lotesEmpresa: Lotes): void {
        const idx = this.listaLotes.indexOf(lote);
        if (idx === -1) throw new Error("El lote no se encuentra en tu lista");
        this.listaLotes.splice(idx, 1);
        lotesEmpresa.agregarLoteDonado(lote);
    }

    public venderLote(lote: LoteAlimento): LoteAlimento {
        const idx = this.listaLotes.indexOf(lote);
        if (idx === -1) throw new Error("El lote no se encuentra en tu lista");
        this.listaLotes.splice(idx, 1);
        this.cuentaBancaria.depositar(lote.getPrecioTotal());
        return lote;
    }

    public getAlertas(umbralStock: number = 10, diasVencimiento: number = 7): Alerta[] {
        return Alerta.generarAlertas(this.listaLotes, umbralStock, diasVencimiento);
    }
}