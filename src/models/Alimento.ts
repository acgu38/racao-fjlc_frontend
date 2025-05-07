import { GenericModel } from './Types';

export interface Alimento extends GenericModel {
  id: string;
  nome: string;
  energiaMetabolizavel: number;
  materiaSeca: number;
  proteinaBruta: number;
  fibraDetergenteNeutro: number;
  lignina: number;
  nutrientesDigestiveisTotais: number;
  categoria: string;
  preco: number;
  disponibilidade: boolean;
}