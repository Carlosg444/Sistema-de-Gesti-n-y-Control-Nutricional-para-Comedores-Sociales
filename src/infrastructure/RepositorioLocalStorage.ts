// ============================================================
// infrastructure/RepositorioLocalStorage.ts
// Maneja toda la persistencia en localStorage.
// Reemplaza el manejo directo de localStorage en el HTML.
// ============================================================

import { Alimento } from "../domain/Alimento";
import { CategoriaAlimento } from "../domain/CategoriaAlimento";
import { Cse } from "../domain/Cse";
import { LoteAlimento } from "../domain/LoteAlimento";
import { Beneficiario } from "../domain/Beneficiario";
import { PlanNutricional } from "../domain/PlanNutricional";
import { Donativo } from "../domain/Donativo";
import { MovimientoAlmacen } from "../domain/MovimientoAlmacen";
import { TipoMovimiento } from "../domain/TipoMovimiento";
import { CuentaBancaria } from "../domain/CuentaBancaria";
import { CuentaEmpresa } from "../domain/CuentaEmpresa";

// ── Tipos planos para serialización ──────────────────────────

export interface LotePlano {
  idLote: number;
  alimento: { nombre: string; categoria: string };
  stock: number;
  precioUnitario: number;
  fechaIngreso: string;
  fechaCaducidad: string;
  origen?: "donado" | "comprado";
  donante?: string;
  proveedor?: string;
}

export interface BeneficiarioPlano {
  nombre: string;
  dni: string;
  numero: number;
  edad: number;
  id: string;
  cse: string;
  plan: { kg: number; desayuno: boolean; almuerzo: boolean; cena: boolean };
}

export interface DonativoPlano {
  nombre: string;
  monto: number;
  fecha: string;
}

export interface MovimientoPlano {
  fecha: string;
  tipo: string;
  alimento: string;
  cantidad: number;
}

export interface UsuarioPlano {
  nombre: string;
  dni: string;
  contrasena: string;
  rol: "Responsable" | "Proveedor";
  cuentaBancaria?: { numero: string; saldo: number };
  listaLotes?: LotePlano[];
}

export interface EstadoApp {
  usuarios: UsuarioPlano[];
  cuentaEmpresa: { numero: string; saldo: number };
  responsableData: {
    almacen: { lotes: LotePlano[]; movimientos: MovimientoPlano[] };
    lotes: { donados: LotePlano[]; comprados: LotePlano[] };
    beneficiarios: BeneficiarioPlano[];
    donativos: DonativoPlano[];
  };
}

// ── Claves de localStorage ────────────────────────────────────

const KEYS = {
  USUARIOS: "nutri_usuarios",
  CUENTA: "nutri_cuenta",
  RESP: "nutri_resp",
} as const;

// ── Conversores: plano ↔ dominio ──────────────────────────────

export function loteDesdeJSON(l: LotePlano): LoteAlimento {
  const alimento = new Alimento(l.alimento.nombre, l.alimento.categoria as CategoriaAlimento);
  return new LoteAlimento(
    l.stock,
    new Date(l.fechaIngreso),
    new Date(l.fechaCaducidad),
    l.idLote,
    alimento,
    l.precioUnitario
  );
}

export function loteAJSON(l: LoteAlimento, extra?: Partial<LotePlano>): LotePlano {
  return {
    idLote: l.getIdLote(),
    alimento: {
      nombre: l.getAlimento().getNombre(),
      categoria: l.getAlimento().getCategoria(),
    },
    stock: l.getStock(),
    precioUnitario: l.getPrecioUnitario(),
    fechaIngreso: l.getFechaIngreso(),
    fechaCaducidad: l.getFechaCaducidad().toISOString(),
    ...extra,
  };
}

export function beneficiarioDesdeJSON(
  b: BeneficiarioPlano
): { beneficiario: Beneficiario; plan: PlanNutricional } {
  const beneficiario = new Beneficiario(
    b.nombre,
    b.dni,
    b.numero,
    b.edad,
    b.id,
    b.cse as Cse
  );
  const plan = new PlanNutricional(
    beneficiario,
    b.plan.kg,
    b.plan.desayuno,
    b.plan.almuerzo,
    b.plan.cena
  );
  return { beneficiario, plan };
}

// ── Repositorio principal ─────────────────────────────────────

export class RepositorioLocalStorage {
  // Carga todo el estado desde localStorage (o usa defaults si es la primera vez)
  static cargar(defaults: EstadoApp): EstadoApp {
    const u = localStorage.getItem(KEYS.USUARIOS);
    const c = localStorage.getItem(KEYS.CUENTA);
    const r = localStorage.getItem(KEYS.RESP);
    return {
      usuarios: u ? JSON.parse(u) : JSON.parse(JSON.stringify(defaults.usuarios)),
      cuentaEmpresa: c ? JSON.parse(c) : JSON.parse(JSON.stringify(defaults.cuentaEmpresa)),
      responsableData: r ? JSON.parse(r) : JSON.parse(JSON.stringify(defaults.responsableData)),
    };
  }

  // Guarda todo el estado en localStorage
  static guardar(estado: EstadoApp): void {
    localStorage.setItem(KEYS.USUARIOS, JSON.stringify(estado.usuarios));
    localStorage.setItem(KEYS.CUENTA, JSON.stringify(estado.cuentaEmpresa));
    localStorage.setItem(KEYS.RESP, JSON.stringify(estado.responsableData));
  }

  // Resetea todo y recarga la página
  static resetear(): void {
    localStorage.removeItem(KEYS.USUARIOS);
    localStorage.removeItem(KEYS.CUENTA);
    localStorage.removeItem(KEYS.RESP);
    location.reload();
  }

  // ── Métodos específicos usando clases del dominio ────────────

  // Reconstruye los LoteAlimento del almacén desde JSON
  static getLotesAlmacen(estado: EstadoApp): LoteAlimento[] {
    return estado.responsableData.almacen.lotes.map(loteDesdeJSON);
  }

  // Reconstruye los Beneficiarios y sus PlanNutricional desde JSON
  static getBeneficiariosConPlanes(
    estado: EstadoApp
  ): { beneficiario: Beneficiario; plan: PlanNutricional }[] {
    return estado.responsableData.beneficiarios.map(beneficiarioDesdeJSON);
  }

  // Sincroniza el saldo de CuentaEmpresa con el estado guardado
  static sincronizarCuentaEmpresa(estado: EstadoApp): void {
    const cuenta = CuentaEmpresa.getInstance();
    const diff = estado.cuentaEmpresa.saldo - cuenta.getSaldo();
    if (diff > 0) cuenta.depositar(diff);
    else if (diff < 0) cuenta.retirar(Math.abs(diff));
  }

  // Guarda un donativo nuevo
  static guardarDonativo(estado: EstadoApp, donativo: Donativo): void {
    estado.responsableData.donativos.push({
      nombre: donativo.getNombreDonante(),
      monto: donativo.getMonto(),
      fecha: donativo.getFecha().toISOString(),
    });
    estado.cuentaEmpresa.saldo = CuentaEmpresa.getInstance().getSaldo();
    this.guardar(estado);
  }

  // Guarda un lote nuevo del proveedor
  static guardarLoteProveedor(
    estado: EstadoApp,
    usuarioDni: string,
    lote: LoteAlimento
  ): void {
    const usuario = estado.usuarios.find((u) => u.dni === usuarioDni);
    if (!usuario || !usuario.listaLotes) return;
    usuario.listaLotes.push(loteAJSON(lote));
    this.guardar(estado);
  }

  // Guarda un movimiento de almacén
  static guardarMovimiento(
    estado: EstadoApp,
    movimiento: MovimientoAlmacen,
    nombreAlimento: string
  ): void {
    movimiento.realizarMovimiento();
    estado.responsableData.almacen.movimientos.unshift({
      fecha: movimiento.getFecha().toISOString(),
      tipo: movimiento.getTipo() === TipoMovimiento.Entrada ? "Entrada" : "Salida",
      alimento: nombreAlimento,
      cantidad: movimiento.getCantidad(),
    });
    this.guardar(estado);
  }

  // Guarda un beneficiario nuevo
  static guardarBeneficiario(
    estado: EstadoApp,
    beneficiario: Beneficiario,
    plan: PlanNutricional
  ): void {
    estado.responsableData.beneficiarios.push({
      nombre: beneficiario.getNombre(),
      dni: beneficiario.getDni(),
      numero: 0,
      edad: beneficiario.getEdad(),
      id: beneficiario.getId(),
      cse: beneficiario.getCse(),
      plan: {
        kg: (plan as any).kg,
        desayuno: (plan as any).desayuno,
        almuerzo: (plan as any).almuerzo,
        cena: (plan as any).cena,
      },
    });
    this.guardar(estado);
  }
}