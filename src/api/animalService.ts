import axios from 'axios';
import { Animal } from '../models/Animal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getAnimais = async (): Promise<Animal[]> => {
  const response = await axios.get(`${API_URL}/animais`);
  return response.data;
};

export const getAnimaisPorIds = async (ids: string[]): Promise<Animal[]> => {
  const response = await axios.get(`${API_URL}/animais?ids=${ids}`);
  return response.data;
};

export const getAnimaisComProducao = async (
  dias: number
): Promise<Animal[]> => {
  const response = await axios.get(`${API_URL}/animais/producao?dias=${dias}`);
  return response.data;
};

export const getAnimalById = async (id: string): Promise<Animal> => {
  const response = await axios.get(`${API_URL}/animais/${id}`);
  return response.data;
};

export const createAnimal = async (animal: Animal): Promise<Animal> => {
  const response = await axios.post(`${API_URL}/animais`, animal);
  return response.data;
};

export const updateAnimal = async (
  id: string,
  animal: Animal
): Promise<Animal> => {
  const response = await axios.put(`${API_URL}/animais/${id}`, animal);
  return response.data;
};

export const deleteAnimal = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/animais/${id}`);
};

export const getEstagiosProducao = async () => {
  const response = await axios.get(`${API_URL}/estagios-producao`);
  return response.data;
};
