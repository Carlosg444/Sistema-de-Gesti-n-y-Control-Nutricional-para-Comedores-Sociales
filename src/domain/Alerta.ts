import { LoteAlimento } from "./LoteAlimento";
import { differenceInDays } from "date-fns";


export class AlertaCaducidad {
    public aCaducido(lote: LoteAlimento): string {
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
    public hayStock(lote: LoteAlimento): string {
        if (lote.getCantidad() == 0) {
            return "No hay stock";
        } else if (lote.getCantidad() == 1) {
            return "Stock apunto de acabarse";
        } else if (lote.getCantidad() <= 3) {
            return "Stock cerca de acabarse";
        } else if (lote.getCantidad() <= 5) {
            return "Poco stock";
        }
        return "Sin alerta";
    }
}


 