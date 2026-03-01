import { Usuario } from "./Usuario";
import { RolUsuario } from "./RolUsuario";
import { Almacen } from "../application/Almacen";
import { Lotes } from "../application/Lotes";
import { Beneficiario } from "./Beneficiario";
import { PlanNutricional } from "./PlanNutricional";
import { Donativo } from "./Donativo";
import { CuentaEmpresa } from "./CuentaEmpresa";
import { Alerta } from "./Alerta";
import { MenuDiario, MenuDia } from "./MenuDiario";

export class Responsable extends Usuario {
    // Recursos compartidos entre todos los responsables (estáticos)
    private static almacenEmpresa: Almacen;
    private static lotesEmpresa: Lotes;
    private static beneficiariosEmpresa: Beneficiario[] = [];
    private static planesNutricionales: Map<string, PlanNutricional> = new Map();
    private static donativosEmpresa: Donativo[] = [];

    constructor(nombre: string, dni: string) {
        super(nombre, dni, RolUsuario.Responsable, "");
    }

    // Inicializar los recursos compartidos (llamar una sola vez al inicio)
    public static inicializar(almacen: Almacen, lotes: Lotes): void {
        Responsable.almacenEmpresa = almacen;
        Responsable.lotesEmpresa = lotes;
    }

    // ── Almacén ──────────────────────────────────────────────
    public getAlmacen(): Almacen {
        return Responsable.almacenEmpresa;
    }

    public getLotes(): Lotes {
        return Responsable.lotesEmpresa;
    }

    // ── Cuenta empresa ───────────────────────────────────────
    public getCuentaEmpresa(): CuentaEmpresa {
        return CuentaEmpresa.getInstance();
    }

    // ── Donativos ────────────────────────────────────────────
    public registrarDonativo(nombreDonante: string, monto: number): Donativo {
        const donativo = new Donativo(nombreDonante, monto);
        Responsable.donativosEmpresa.push(donativo);
        return donativo;
    }

    public getDonativos(): Donativo[] {
        return Responsable.donativosEmpresa;
    }

    // ── Beneficiarios ────────────────────────────────────────
    public registrarBeneficiario(beneficiario: Beneficiario, plan: PlanNutricional): void {
        Responsable.beneficiariosEmpresa.push(beneficiario);
        Responsable.planesNutricionales.set(beneficiario.getId(), plan);
    }

    public getBeneficiarios(): Beneficiario[] {
        return Responsable.beneficiariosEmpresa;
    }

    public getPlanNutricional(beneficiario: Beneficiario): PlanNutricional | undefined {
        return Responsable.planesNutricionales.get(beneficiario.getId());
    }

    public getPlanesNutricionales(): Map<string, PlanNutricional> {
        return Responsable.planesNutricionales;
    }

    // ── Alertas ──────────────────────────────────────────────
    public getAlertas(umbralStock: number = 10, diasVencimiento: number = 7): Alerta[] {
        return Alerta.generarAlertas(
            Responsable.almacenEmpresa.getLotes(),
            umbralStock,
            diasVencimiento
        );
    }

    // ── Menú diario ──────────────────────────────────────────
    public generarMenuDiario(): MenuDia {
        return MenuDiario.generarMenu(
            Responsable.almacenEmpresa.getLotes(),
            Responsable.beneficiariosEmpresa,
            Responsable.planesNutricionales
        );
    }

    // ── Comprar lote ─────────────────────────────────────────
    public comprarLote(lote: import("./LoteAlimento").LoteAlimento): void {
        Responsable.lotesEmpresa.comprarLote(lote);
    }
}