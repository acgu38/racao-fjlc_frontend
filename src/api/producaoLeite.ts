import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const createProducaoLeite = async (data: any) => {
  const response = await axios.post(`${API_URL}/producao-leite`, data);
  return response.data;
};

export const getProducaoLeite = async () => {
  const response = await axios.get(`${API_URL}/producao-leite`);
  return response.data;
};

export const getProducaoLeitePorId = async (id: string) => {
  const response = await axios.get(`${API_URL}/producao-leite/${id}`);
  return response.data;
};

export const updateProducaoLeite = async (id: string, data: any) => {
  const response = await axios.put(`${API_URL}/producao-leite/${id}`, data);
  return response.data;
};

export const deleteProducaoLeite = async (id: string) => {
  const response = await axios.delete(`${API_URL}/producao-leite/${id}`);
  return response.data;
};

// Nova função para calcular a média de produção dos últimos X dias
export const calculateMediaProducao = async (
  animalIds: string[],
  dias: number
) => {
  const response = await axios.post(`${API_URL}/producao-leite/media`, {
    animalIds,
    dias,
  });
  return response.data;
};
