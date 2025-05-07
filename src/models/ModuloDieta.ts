import { GenericModel } from './Types';
import { ComponenteDieta } from './ComponenteDieta';

export interface ModuloDieta extends GenericModel {
  categoria: string;
  componentes: ComponenteDieta[];
}
