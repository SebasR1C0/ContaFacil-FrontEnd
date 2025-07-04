export interface FlujoCaja {
  idFlujoCaja: number;
  periodo: number;
  fechaProgramada: string; // LocalDate from backend
  plazoGracia: string;
  bono: number;
  bonoIndexado: number;
  cuponInteres: number;
  cuota: number;
  amortizacion: number;
  prima: number;
  escudo: number;
  flujoEmisor: number;
  flujoEmisorEscudo: number;
  flujoBonista: number;
  flujoAct: number;
  faPlazo: number;
  convexidad: number;
  bonos: any; // Relación con Bono
}

export interface FlujoCajaListResponse {
  flujos: FlujoCaja[];
  total: number;
}
