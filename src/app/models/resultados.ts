import { Bono } from "./bono";

export class ResultadosFinancieros{
    idResultadosFinancieros: number=0;
    precioActual: number=0;
    utilidad: number=0;
    duracion: number=0;
    convexidad: number=0;
    duracionModificada: number=0;
    total: number=0;
    precioMaxMercado: number=0;
    tceaEmisor: number=0;
    tceaEmisorEscudo: number=0;
    treaBonista: number=0;

    bonos: Bono = new Bono();
}