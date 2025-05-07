import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getAlimentos = async () => {
  const response = await axios.get(`${API_URL}/alimentos`);
  return response.data;
};

export const getAlimentoById = async (id: string) => {
  const response = await axios.get(`${API_URL}/alimentos/${id}`);
  return response.data;
};

export const createAlimento = async (alimento: any) => {
  const response = await axios.post(`${API_URL}/alimentos`, alimento);
  return response.data;
};

export const updateAlimento = async (id: string, alimento: any) => {
  const response = await axios.put(`${API_URL}/alimentos/${id}`, alimento);
  return response.data;
};

export const deleteAlimento = async (id: string) => {
  const response = await axios.delete(`${API_URL}/alimentos/${id}`);
  return response.data;
};

export const getCategorias = async () => {
  const response = await axios.get(`${API_URL}/categorias`);
  return response.data;
};
