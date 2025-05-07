import { GenericModel } from './Types';
import { Alimento } from './Alimento';

export interface ComponenteDieta extends GenericModel {
  nome: string;
  quantidade: number;
  unidadeMedida: string;
  alimento: Alimento;
}
