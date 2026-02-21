export class Fecha {
    private dia: number;
    private mes: number;
    private anio: number;

    constructor(dia: number, mes: number, anio: number) {

        if (mes< 1 || mes> 12) {
            throw new Error("Mes inválido");
        }
        let diasDelMes= 31;

        if (mes== 4 || mes== 6 || mes== 9 || mes== 11) {
            diasDelMes= 30;
        }
        if (mes== 2) {
            if ((anio%4== 0 && anio%100!= 0) || (anio%400== 0)) {
                diasDelMes= 29; 
            } else {
                diasDelMes= 28;
            }
        }
        if (dia< 1 || dia> diasDelMes) {
            throw new Error("Día inválido");
        }

        this.dia= dia;
        this.mes= mes;
        this.anio= anio;
    }

    public esMenorQue(o: Fecha): boolean {

        if (this.anio< o.anio) {
            return true;
        }
        if (this.anio > o.anio) {
            return false;
        }
        if (this.mes< o.mes) {
            return true;
        }
        if (this.mes> o.mes) {
            return false;
        }
        if (this.dia < o.dia) {
            return true;
        }
        return false;
    }

    public sumarDias(n: number): void {
        this.dia= this.dia+n;
        let diasDelMes = 31;
        if (this.mes== 4 || this.mes== 6 || this.mes== 9 || this.mes== 11) {
            diasDelMes= 30;
        }
        if (this.mes== 2) {
            if ((this.anio%4== 0 && this.anio%100!= 0) || (this.anio%400== 0)) {
                diasDelMes= 29;
            } else {
                diasDelMes= 28;
            }
        }
        if (this.dia> diasDelMes) {
            this.dia= this.dia-diasDelMes;
            this.mes= this.mes+1;

            if (this.mes> 12) {
                this.mes= 1;
                this.anio= this.anio+1;
            }
        }
    }
    public mostrar(): string {
        return this.dia + "/" + this.mes + "/" + this.anio;
    }
}