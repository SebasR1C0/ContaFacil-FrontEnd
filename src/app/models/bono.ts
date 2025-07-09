import { User } from './users';
import { CatalogoMoneda } from './catalogomoneda';
export class Bono {
  idBono: number = 0;
  nombreBono: string = '';
  valorNominal: number = 0;
  numeroAños: number = 0;
  frecuenciaCupon: string = '';
  diasPorAno: number = 0;
  tipoTasa: string = '';
  capitalizacion: string = '';
  tasaInteres: number = 0;
  tasaAnualDescuento: number = 0;
  impuesto: number = 0;
  fechaEmision: string = '';
  inflacion: number = 0;
  plazoTipo: string = '';
  plazoPeridos: number = 0;
  prima: number = 0;
  costesInicialesBonista: number = 0;
  costesInicialesOtros: number = 0;
  emitido: boolean = false; // Nuevo atributo para controlar el estado de emisión
  idCatalogoMoneda: any = {};
  idUsers: any = {};
}