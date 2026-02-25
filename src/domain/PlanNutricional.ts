import { Beneficiario } from "./Beneficiario";
export class PlanNutricional{
    constructor (
        private beneficiario: Beneficiario,
        private kg: number,
        private desayuno: boolean,
        private almuerzo: boolean,
        private cena: boolean
    ){}
    public caloriasDiarias(): number {
        if (this.kg <= 5) return 500;
        if (this.kg <= 10) return 700;
        if (this.kg <= 15) return 1200;
        if (this.kg <= 20) return 1600;
        if (this.kg <= 30) return 1900;
        if (this.kg <= 40) return 2200;
        if (this.kg <= 50) return 2400;
        if (this.kg <= 60) return 2600;
        if (this.kg <= 70) return 2800;
        if (this.kg <= 80) return 3000;
        if (this.kg <= 90) return 3200;
        return 3400;
    }
    public protesDiarias(): number {
        if (this.kg <= 5) return 10;
        if (this.kg <= 10) return 15;
        if (this.kg <= 15) return 25;
        if (this.kg <= 20) return 35;
        if (this.kg <= 30) return 45;
        if (this.kg <= 40) return 55;
        if (this.kg <= 50) return 65;
        if (this.kg <= 60) return 75;
        if (this.kg <= 70) return 85;
        if (this.kg <= 80) return 95;
        if (this.kg <= 90) return 105;
        return 110;
    }
    public caloriasFaltantes(){
        let calorias= this.caloriasDiarias();
        if (this.desayuno) calorias-=calorias*0.3
        if (this.almuerzo) calorias-=calorias*0.4
        if (this.cena) calorias-=calorias*0.3
        return calorias;
    }
    public protesFaltantes(){
        let protes= this.protesDiarias();
        if (this.desayuno) protes-=protes*0.3
        if (this.almuerzo) protes-=protes*0.4
        if (this.cena) protes-=protes*0.3
        return protes;
    }
}