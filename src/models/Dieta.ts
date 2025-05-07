import { GenericModel } from './Types';
import { ModuloDieta } from './ModuloDieta';

export interface Dieta extends GenericModel {
  id: string;
  nome: string;
  descricao: string;
  modulos?: ModuloDieta[];
}