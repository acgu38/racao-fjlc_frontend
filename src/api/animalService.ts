// Exemplo de src/api/animalService.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getAnimais = async () => {
  const response = await axios.get(`${API_URL}/animais`);
  return response.data;
};

export const createAnimal = async (animal: any) => {
  const response = await axios.post(`${API_URL}/animais`, animal);
  return response.data;
};

// Outras funções: buscarPorId, atualizar, deletar...
