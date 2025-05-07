import { GenericModel } from './Types';
import { Animal } from './Animal';
import { Dieta } from './Dieta';

export interface Lote extends GenericModel {
  id: string;
  nome: string;
  dieta?: Dieta;
  animais?: Animal[];
}