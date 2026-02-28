import { Alimento } from "../../domain/Alimento";
import { CategoriaAlimento } from "../../domain/CategoriaAlimento";
import { CuentaBancaria } from "../../domain/CuentaBancaria";
import { LoteAlimento } from "../../domain/LoteAlimento";
import { Almacen } from "../../application/Almacen";
import { Lotes } from "../../application/Lotes";

function main(){
    try {
        const cuentaBancaria = new CuentaBancaria("123456789", 1000);
        const lote = new LoteAlimento(10, new Date(), new Date("2026-12-31"), 1, new Alimento("Pollo", CategoriaAlimento.Proteina), 10);
        const almacen = new Almacen([], []);
        const lotes = new Lotes([], []);
        lotes.comprarLote(lote, cuentaBancaria);
        almacen.agregarLote(lote);
        console.log(almacen.getLotes());
        console.log(lotes.getLotesComprados());
        console.log(cuentaBancaria.getSaldo());
    } catch (error) {
        console.error("Error:", error);
    }
}

main();