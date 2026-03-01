import { LoteAlimento } from "./LoteAlimento";
import { Beneficiario } from "./Beneficiario";
import { PlanNutricional } from "./PlanNutricional";
import { CategoriaAlimento } from "./CategoriaAlimento";

export interface PorcionBeneficiario {
    beneficiario: Beneficiario;
    caloriasAsignadas: number;
    proteinasAsignadas: number;
    porcionesAlimentos: { nombreAlimento: string; cantidad: number }[];
}

export interface MenuDia {
    fecha: Date;
    combinacion: LoteAlimento[];         // lotes que conforman el menú del día
    porciones: PorcionBeneficiario[];    // cuánto recibe cada beneficiario
    totalCaloriasCubiertas: number;
    totalProteinasCubiertas: number;
}

export class MenuDiario {

    // Calorías y proteínas aproximadas por unidad de cada categoría
    private static caloriasPorCategoria: Record<CategoriaAlimento, number> = {
        [CategoriaAlimento.Proteina]: 200,
        [CategoriaAlimento.Lacteo]: 150,
        [CategoriaAlimento.Cereal]: 300,
        [CategoriaAlimento.Tuberculo]: 200,
        [CategoriaAlimento.Verdura]: 50,
        [CategoriaAlimento.Fruta]: 80,
        [CategoriaAlimento.Grasa]: 120,
        [CategoriaAlimento.Condimento]: 20,
        [CategoriaAlimento.Legumbre]: 250,
    };

    private static protesPorCategoria: Record<CategoriaAlimento, number> = {
        [CategoriaAlimento.Proteina]: 25,
        [CategoriaAlimento.Lacteo]: 8,
        [CategoriaAlimento.Cereal]: 7,
        [CategoriaAlimento.Tuberculo]: 4,
        [CategoriaAlimento.Verdura]: 2,
        [CategoriaAlimento.Fruta]: 1,
        [CategoriaAlimento.Grasa]: 1,
        [CategoriaAlimento.Condimento]: 0,
        [CategoriaAlimento.Legumbre]: 15,
    };

    /**
     * Genera el menú del día combinando los lotes disponibles en el almacén.
     * Prioriza lotes con menos stock (para rotar) y más próximos a vencer.
     * Calcula cuánto recibe cada beneficiario según sus necesidades.
     */
    public static generarMenu(
        lotesDisponibles: LoteAlimento[],
        beneficiarios: Beneficiario[],
        planesNutricionales: Map<string, PlanNutricional>
    ): MenuDia {
        // Filtrar lotes con stock > 0 y no vencidos
        const hoy = new Date();
        const lotesValidos = lotesDisponibles
            .filter(l => l.getStock() > 0 && l.getFechaCaducidad() > hoy)
            .sort((a, b) => {
                // Primero los que vencen antes, luego los de menor stock
                const diffVenc = a.getFechaCaducidad().getTime() - b.getFechaCaducidad().getTime();
                if (diffVenc !== 0) return diffVenc;
                return a.getStock() - b.getStock();
            });

        if (lotesValidos.length === 0) {
            throw new Error("No hay lotes disponibles para generar el menú");
        }

        // Seleccionar combinación: buscar al menos una proteína + un cereal/tubérculo
        const combinacion: LoteAlimento[] = [];
        const categoriasEnMenu = new Set<CategoriaAlimento>();

        // Prioridad de categorías para un menú balanceado
        const prioridad: CategoriaAlimento[] = [
            CategoriaAlimento.Proteina,
            CategoriaAlimento.Cereal,
            CategoriaAlimento.Tuberculo,
            CategoriaAlimento.Verdura,
            CategoriaAlimento.Legumbre,
            CategoriaAlimento.Fruta,
            CategoriaAlimento.Lacteo,
        ];

        for (const categoria of prioridad) {
            const lote = lotesValidos.find(
                l => l.getAlimento().getCategoria() === categoria && !categoriasEnMenu.has(categoria)
            );
            if (lote) {
                combinacion.push(lote);
                categoriasEnMenu.add(categoria);
            }
            if (combinacion.length >= 4) break; // máximo 4 alimentos por menú
        }

        // Si no encontramos combinación mínima, tomar los primeros disponibles
        if (combinacion.length === 0) {
            combinacion.push(...lotesValidos.slice(0, Math.min(3, lotesValidos.length)));
        }

        // Calcular porciones por beneficiario
        const porciones: PorcionBeneficiario[] = [];

        for (const beneficiario of beneficiarios) {
            const plan = planesNutricionales.get(beneficiario.getId());
            if (!plan) continue;

            const caloriasNecesarias = plan.caloriasFaltantes();
            const proteinasNecesarias = plan.protesFaltantes();

            const porcionesAlimentos: { nombreAlimento: string; cantidad: number }[] = [];
            let caloriasAsignadas = 0;
            let proteinasAsignadas = 0;

            // Distribuir equitativamente entre los alimentos del menú
            const calPorAlimento = caloriasNecesarias / combinacion.length;

            for (const lote of combinacion) {
                const categoria = lote.getAlimento().getCategoria();
                const calPorUnidad = MenuDiario.caloriasPorCategoria[categoria];
                const protPorUnidad = MenuDiario.protesPorCategoria[categoria];

                const cantidad = Math.max(1, Math.round(calPorAlimento / calPorUnidad));
                caloriasAsignadas += cantidad * calPorUnidad;
                proteinasAsignadas += cantidad * protPorUnidad;

                porcionesAlimentos.push({
                    nombreAlimento: lote.getAlimento().getNombre(),
                    cantidad
                });
            }

            porciones.push({
                beneficiario,
                caloriasAsignadas,
                proteinasAsignadas,
                porcionesAlimentos
            });
        }

        const totalCaloriasCubiertas = porciones.reduce((s, p) => s + p.caloriasAsignadas, 0);
        const totalProteinasCubiertas = porciones.reduce((s, p) => s + p.proteinasAsignadas, 0);

        return {
            fecha: new Date(),
            combinacion,
            porciones,
            totalCaloriasCubiertas,
            totalProteinasCubiertas
        };
    }
}