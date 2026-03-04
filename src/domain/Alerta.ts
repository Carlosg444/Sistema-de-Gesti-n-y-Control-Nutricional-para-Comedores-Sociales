import { LoteAlimento } from "./LoteAlimento";

export enum TipoAlerta {
    StockBajo,
    VencimientoProximo
}

export class Alerta {
    private fecha: Date;

    constructor(
        private tipo: TipoAlerta,
        private lote: LoteAlimento,
        private mensaje: string
    ) {
        this.fecha = new Date();
    }

    public getTipo(): TipoAlerta {
        return this.tipo;
    }

    public getLote(): LoteAlimento {
        return this.lote;
    }

    public getMensaje(): string {
        return this.mensaje;
    }

    public getFecha(): Date {
        return this.fecha;
    }

    public toString(): string {
        const tipo = this.tipo === TipoAlerta.StockBajo ? "Stock Bajo" : "Vencimiento Proximo";
        return `[${tipo}] ${this.mensaje}`;
    }

    public static generarAlertas(
        lotes: LoteAlimento[],
        umbralStock: number = 10,
        diasVencimiento: number = 7
    ): Alerta[] {
        const alertas: Alerta[] = [];
        const hoy = new Date();

        for (const lote of lotes) {
            // Alerta de stock bajo
            if (lote.getStock() <= umbralStock) {
                alertas.push(new Alerta(
                    TipoAlerta.StockBajo,
                    lote,
                    `El lote #${lote.getIdLote()} de "${lote.getAlimento().getNombre()}" tiene stock bajo: ${lote.getStock()} unidades`
                ));
            }

            // Alerta de vencimiento próximo
            const diasRestantes = Math.ceil(
                (lote.getFechaCaducidad().getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (diasRestantes <= diasVencimiento && diasRestantes >= 0) {
                alertas.push(new Alerta(
                    TipoAlerta.VencimientoProximo,
                    lote,
                    `El lote #${lote.getIdLote()} de "${lote.getAlimento().getNombre()}" vence en ${diasRestantes} día(s)`
                ));
            }

            // Alerta si ya venció
            if (diasRestantes < 0) {
                alertas.push(new Alerta(
                    TipoAlerta.VencimientoProximo,
                    lote,
                    `El lote #${lote.getIdLote()} de "${lote.getAlimento().getNombre()}" ya venció hace ${Math.abs(diasRestantes)} día(s)`
                ));
            }
        }

        return alertas;
    }
}