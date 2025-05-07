import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getDietas = async () => {
  const response = await axios.get(`${API_URL}/dietas`);
  return response.data;
};

export const getDietaById = async (id: string) => {
  const response = await axios.get(`${API_URL}/dietas/${id}`);
  return response.data;
};

export const createDieta = async (dieta: any) => {
  const response = await axios.post(`${API_URL}/dietas`, dieta);
  return response.data;
};

export const updateDieta = async (id: string, dieta: any) => {
  const response = await axios.put(`${API_URL}/dietas/${id}`, dieta);
  return response.data;
};

export const deleteDieta = async (id: string) => {
  const response = await axios.delete(`${API_URL}/dietas/${id}`);
  return response.data;
};