import { LoteAlimento } from "./LoteAlimento";
import { differenceInDays } from "date-fns";


export class AlertaCaducidad {
    public generarAlerta(lote: LoteAlimento): string {
        const hoy = new Date();
        const dias = differenceInDays(lote.getFechaCaducidad(), hoy);

        if (dias <= 0) {
            return "Producto vencido";
        } else if (dias <= 1) {
            return "Nivel crítico";
        } else if (dias <= 3) {
            return "Advertencia";
        } else if (dias <= 7) {
            return "Informativo";
        }
        return "Sin alerta";
    }
}


 