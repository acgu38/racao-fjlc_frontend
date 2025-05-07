import { GenericModel } from './Types';

export interface Animal extends GenericModel {
  id: string;
  nome: string;
  estagioProducao: string;
  producaoDiariaLeite: number;
  dataNascimento: string;
}
