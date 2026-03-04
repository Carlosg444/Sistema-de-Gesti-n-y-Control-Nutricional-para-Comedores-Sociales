import { Alimento } from "../domain/Alimento";
import { CategoriaAlimento } from "../domain/CategoriaAlimento";
import { Cse } from "../domain/Cse";
import { LoteAlimento } from "../domain/LoteAlimento";
import { Beneficiario } from "../domain/Beneficiario";
import { PlanNutricional } from "../domain/PlanNutricional";
import { Donativo } from "../domain/Donativo";
import { CuentaEmpresa } from "../domain/CuentaEmpresa";
import { MenuDiario } from "../domain/MenuDiario";
import { Almacen } from "../application/Almacen";
import { Lotes } from "../application/Lotes";
import { Responsable } from "../domain/Responsable";
import {
  RepositorioLocalStorage,
  EstadoApp,
  loteAJSON,
  beneficiarioDesdeJSON,
  loteDesdeJSON,
} from "../infrastructure/RepositorioLocalStorage";

declare function showError(id: string, msg: string): void;
declare function hideError(id: string): void;
declare function showSuccess(id: string, msg: string): void;
declare function closeModal(id: string): void;

const DEFAULTS: EstadoApp = {
  usuarios: [
    { nombre: "Ana Torres", dni: "00000001", contrasena: "123456", rol: "Responsable" },
    {
      nombre: "Proveedor Alimentos SAC", dni: "00000002", contrasena: "123456", rol: "Proveedor",
      cuentaBancaria: { numero: "00000000000000000002", saldo: 8000 },
      listaLotes: [
        { idLote: 20, alimento: { nombre: "Pechuga de pollo", categoria: "PROTEINAS" }, stock: 120, precioUnitario: 9.5,  fechaIngreso: "2026-01-10", fechaCaducidad: "2026-09-01" },
        { idLote: 21, alimento: { nombre: "Carne de res",     categoria: "PROTEINAS" }, stock: 80,  precioUnitario: 14.0, fechaIngreso: "2026-01-10", fechaCaducidad: "2026-08-01" },
        { idLote: 22, alimento: { nombre: "Leche evaporada",  categoria: "LACTEO"    }, stock: 200, precioUnitario: 3.5,  fechaIngreso: "2026-01-15", fechaCaducidad: "2026-12-01" },
      ],
    },
  ],
  cuentaEmpresa: { numero: "00000000000000000001", saldo: 500 },
  responsableData: {
    almacen: {
      lotes: [
        { idLote: 1,  alimento: { nombre: "Leche fresca",    categoria: "LACTEO"    }, stock: 150, precioUnitario: 3.2, fechaIngreso: "2026-01-01", fechaCaducidad: "2026-10-01", origen: "donado"   },
        { idLote: 2,  alimento: { nombre: "Pan de molde",    categoria: "CEREAL"    }, stock: 300, precioUnitario: 1.5, fechaIngreso: "2026-01-05", fechaCaducidad: "2026-11-01", origen: "comprado" },
        { idLote: 3,  alimento: { nombre: "Huevo",           categoria: "PROTEINAS" }, stock: 500, precioUnitario: 0.5, fechaIngreso: "2026-01-10", fechaCaducidad: "2026-06-01", origen: "donado"   },
        { idLote: 6,  alimento: { nombre: "Arroz blanco",    categoria: "CEREAL"    }, stock: 400, precioUnitario: 2.5, fechaIngreso: "2026-01-01", fechaCaducidad: "2027-01-01", origen: "comprado" },
        { idLote: 7,  alimento: { nombre: "Pollo entero",    categoria: "PROTEINAS" }, stock: 100, precioUnitario: 8.0, fechaIngreso: "2026-02-01", fechaCaducidad: "2026-08-01", origen: "comprado" },
        { idLote: 8,  alimento: { nombre: "Papa amarilla",   categoria: "TUBERCULO" }, stock: 250, precioUnitario: 1.2, fechaIngreso: "2026-01-15", fechaCaducidad: "2026-07-01", origen: "donado"   },
        { idLote: 9,  alimento: { nombre: "Frijoles negros", categoria: "LEGUMBRE"  }, stock: 180, precioUnitario: 4.0, fechaIngreso: "2026-01-01", fechaCaducidad: "2027-03-01", origen: "donado"   },
        { idLote: 14, alimento: { nombre: "Atún en lata",    categoria: "PROTEINAS" }, stock: 200, precioUnitario: 5.5, fechaIngreso: "2026-01-01", fechaCaducidad: "2027-06-01", origen: "comprado" },
      ],
      movimientos: [],
    },
    lotes: { donados: [], comprados: [] },
    beneficiarios: [
      { nombre: "María Quispe", dni: "45678901", numero: 987001001, edad: 38, id: "BEN-001", cse: "PobreExtremo", plan: { kg: 55, desayuno: false, almuerzo: false, cena: false } },
      { nombre: "Pedro Huanca", dni: "45678902", numero: 987001002, edad: 62, id: "BEN-002", cse: "Pobre",        plan: { kg: 70, desayuno: true,  almuerzo: false, cena: false } },
      { nombre: "Rosa Mamani",  dni: "45678903", numero: 987001003, edad: 7,  id: "BEN-003", cse: "PobreExtremo", plan: { kg: 22, desayuno: false, almuerzo: true,  cena: false } },
      { nombre: "Luis Condori", dni: "45678904", numero: 987001004, edad: 45, id: "BEN-004", cse: "Pobre",        plan: { kg: 80, desayuno: true,  almuerzo: true,  cena: false } },
    ],
    donativos: [
      { nombre: "Empresa XYZ",  monto: 300, fecha: "2026-01-15" },
      { nombre: "Carlos Ramos", monto: 200, fecha: "2026-02-01" },
    ],
  },
};

// Estado global sincronizado con localStorage
const estado: EstadoApp = RepositorioLocalStorage.cargar(DEFAULTS);

// Inicializar dominio
const almacen = new Almacen([], []);
const lotes   = new Lotes([], [], almacen);
Responsable.inicializar(almacen, lotes);

// Sincronizar CuentaEmpresa singleton
const _cuenta = CuentaEmpresa.getInstance();
const _diff   = estado.cuentaEmpresa.saldo - _cuenta.getSaldo();
if (_diff > 0) _cuenta.depositar(_diff);
else if (_diff < 0) _cuenta.retirar(Math.abs(_diff));

// ── Donativo ─────────────────────────────────────────────────
function registrarDonativoDOM(): void {
  const nombre = (document.getElementById("don-nombre") as HTMLInputElement).value.trim();
  const monto  = parseFloat((document.getElementById("don-monto") as HTMLInputElement).value);
  hideError("modal-don-error");
  if (!nombre) { showError("modal-don-error", "Ingresa el nombre del donante."); return; }
  if (!monto || monto <= 0) { showError("modal-don-error", "El monto debe ser mayor a 0."); return; }
  try {
    const donativo = new Donativo(nombre, monto);
    estado.responsableData.donativos.push({ nombre: donativo.getNombreDonante(), monto: donativo.getMonto(), fecha: donativo.getFecha().toISOString() });
    estado.cuentaEmpresa.saldo = CuentaEmpresa.getInstance().getSaldo();
    // Sincronizar con variable global del HTML
    (window as any).cuentaEmpresa.saldo = estado.cuentaEmpresa.saldo;
    (window as any).responsableData.donativos = estado.responsableData.donativos;
    RepositorioLocalStorage.guardar(estado);
    const el = document.getElementById("sidebar-saldo");
    if (el) el.textContent = `S/. ${estado.cuentaEmpresa.saldo.toFixed(2)}`;
    showSuccess("modal-don-success", `✓ Donativo de S/. ${monto.toFixed(2)} registrado.`);
    (document.getElementById("don-nombre") as HTMLInputElement).value = "";
    (document.getElementById("don-monto") as HTMLInputElement).value  = "";
    setTimeout(() => { closeModal("modal-add-donativo"); (window as any).renderDonativos?.(); }, 1500);
  } catch (e: any) { showError("modal-don-error", e.message); }
}

// ── Agregar lote proveedor ────────────────────────────────────
function agregarLoteDOM(): void {
  const user = (window as any).currentUser;
  if (!user) return;
  const id       = parseInt((document.getElementById("lote-id") as HTMLInputElement).value);
  const nombre   = (document.getElementById("lote-alimento") as HTMLInputElement).value.trim();
  const categoria = (document.getElementById("lote-categoria") as HTMLSelectElement).value as CategoriaAlimento;
  const stock    = parseInt((document.getElementById("lote-stock") as HTMLInputElement).value);
  const precio   = parseFloat((document.getElementById("lote-precio") as HTMLInputElement).value);
  const ingreso  = (document.getElementById("lote-ingreso") as HTMLInputElement).value;
  const caducidad = (document.getElementById("lote-caducidad") as HTMLInputElement).value;
  if (!id || !nombre || isNaN(stock) || isNaN(precio) || !ingreso || !caducidad) { showError("modal-lote-error", "Completa todos los campos."); return; }
  try {
    const lote = new LoteAlimento(stock, new Date(ingreso), new Date(caducidad), id, new Alimento(nombre, categoria), precio);
    const usuarioEstado = estado.usuarios.find(u => u.dni === user.dni);
    if (usuarioEstado) {
      if (!usuarioEstado.listaLotes) usuarioEstado.listaLotes = [];
      usuarioEstado.listaLotes.push(loteAJSON(lote));
      user.listaLotes = usuarioEstado.listaLotes;
    }
    RepositorioLocalStorage.guardar(estado);
    closeModal("modal-add-lote");
    (window as any).renderMisLotes?.();
  } catch (e: any) { showError("modal-lote-error", e.message); }
}

// ── Registrar beneficiario ────────────────────────────────────
function registrarBeneficiarioDOM(): void {
  const nombre   = (document.getElementById("ben-nombre") as HTMLInputElement).value.trim();
  const dni      = (document.getElementById("ben-dni") as HTMLInputElement).value.trim();
  const numero   = parseInt((document.getElementById("ben-numero") as HTMLInputElement).value);
  const edad     = parseInt((document.getElementById("ben-edad") as HTMLInputElement).value);
  const id       = (document.getElementById("ben-id") as HTMLInputElement).value.trim();
  const cse      = (document.getElementById("ben-cse") as HTMLSelectElement).value as Cse;
  const kg       = parseFloat((document.getElementById("ben-kg") as HTMLInputElement).value);
  const desayuno = (document.getElementById("ben-desayuno") as HTMLInputElement).checked;
  const almuerzo = (document.getElementById("ben-almuerzo") as HTMLInputElement).checked;
  const cena     = (document.getElementById("ben-cena") as HTMLInputElement).checked;
  if (!nombre || !dni || isNaN(edad) || !id || isNaN(kg)) { showError("modal-ben-error", "Completa todos los campos."); return; }
  try {
    const beneficiario = new Beneficiario(nombre, dni, numero, edad, id, cse);
    new PlanNutricional(beneficiario, kg, desayuno, almuerzo, cena);
    estado.responsableData.beneficiarios.push({ nombre, dni, numero, edad, id, cse, plan: { kg, desayuno, almuerzo, cena } });
    (window as any).responsableData.beneficiarios = estado.responsableData.beneficiarios;
    RepositorioLocalStorage.guardar(estado);
    closeModal("modal-add-beneficiario");
    (window as any).renderBeneficiarios?.();
  } catch (e: any) { showError("modal-ben-error", e.message); }
}

// ── Generar menú ──────────────────────────────────────────────
function generarMenuDOM(): void {
  const lotesAlmacen  = estado.responsableData.almacen.lotes.map(loteDesdeJSON);
  const bensConPlanes = estado.responsableData.beneficiarios.map(beneficiarioDesdeJSON);
  const beneficiarios = bensConPlanes.map(b => b.beneficiario);
  const planes        = new Map(bensConPlanes.map(b => [b.beneficiario.getId(), b.plan]));
  try {
    const menu = MenuDiario.generarMenu(lotesAlmacen, beneficiarios, planes);
    const hoy  = new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    document.getElementById("menu-content")!.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
        <div><div style="font-family:'Syne',sans-serif;font-size:22px;font-weight:800">Menú del día</div>
        <div style="font-size:13px;color:var(--muted);margin-top:2px">${hoy}</div></div>
        <span class="badge badge-green">✓ Generado — ${menu.porciones.length} beneficiario(s)</span>
      </div>
      <div class="card"><div class="card-title">🥗 Combinación del día</div>
        <div class="menu-combinacion">
          ${menu.combinacion.map(l => `<div class="menu-alimento-chip">${l.getAlimento().getNombre()} <span style="opacity:0.55;font-size:11px"> · ${l.getAlimento().getCategoria()}</span></div>`).join("")}
        </div>
      </div>
      <div class="card"><div class="card-title">📊 Totales</div>
        <p style="font-size:14px;color:var(--muted)">Calorías: <strong style="color:var(--accent)">${menu.totalCaloriasCubiertas} kcal</strong> &nbsp;|&nbsp; Proteínas: <strong style="color:var(--accent2)">${menu.totalProteinasCubiertas} g</strong></p>
      </div>
      <div class="card-title" style="margin-bottom:12px">🍽️ Porciones por beneficiario</div>
      ${menu.porciones.map(p => `
        <div class="porcion-card">
          <div class="porcion-header"><div><div class="porcion-nombre">${p.beneficiario.getNombre()}</div>
          <div style="font-size:12px;color:var(--muted)">~${p.caloriasAsignadas} kcal · ~${p.proteinasAsignadas}g prot</div></div></div>
          <div class="porcion-items">${p.porcionesAlimentos.map(item => `<div class="porcion-item">${item.nombreAlimento}: <strong>${item.cantidad}</strong> u.</div>`).join("")}</div>
        </div>`).join("")}`;
  } catch (e: any) {
    document.getElementById("menu-content")!.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-text">${(e as Error).message}</div></div>`;
  }
}


document.addEventListener("DOMContentLoaded", () => {
  (window as any).usuarios        = estado.usuarios;
  (window as any).cuentaEmpresa   = estado.cuentaEmpresa;
  (window as any).responsableData = estado.responsableData;
  (window as any).registrarDonativo     = registrarDonativoDOM;
  (window as any).agregarLote           = agregarLoteDOM;
  (window as any).registrarBeneficiario = registrarBeneficiarioDOM;
  (window as any).generarMenu           = generarMenuDOM;
  (window as any).doLogin = function () {
    const dni  = (document.getElementById("login-dni") as HTMLInputElement).value.trim();
    const pass = (document.getElementById("login-pass") as HTMLInputElement).value;
    const user = estado.usuarios.find(u => u.dni === dni && u.contrasena === pass);
    if (!user) {
      const errEl = document.getElementById("auth-error") as HTMLElement;
      errEl.textContent = "DNI o contraseña incorrectos.";
      errEl.style.display = "block";
      return;
    }
    (window as any).currentUser = user;
    (window as any).initApp();
  };

  (window as any).resetearDatos = function () {
    if (!confirm("¿Resetear todos los datos?")) return;
    ["nutri_usuarios","nutri_cuenta","nutri_resp"].forEach(k => localStorage.removeItem(k));
    location.reload();
  };

  console.log("✅ NutriGestión TS conectado");
  console.log(`📦 Lotes: ${estado.responsableData.almacen.lotes.length} | 👥 Beneficiarios: ${estado.responsableData.beneficiarios.length} | 💰 S/. ${estado.cuentaEmpresa.saldo}`);
});