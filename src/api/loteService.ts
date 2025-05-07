import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getLotes = async () => {
  const response = await axios.get(`${API_URL}/lotes`);
  return response.data;
};

export const getLoteById = async (id: string) => {
  const response = await axios.get(`${API_URL}/lotes/${id}`);
  return response.data;
};

export const createLote = async (lote: any) => {
  const response = await axios.post(`${API_URL}/lotes`, lote);
  return response.data;
};

export const updateLote = async (id: string, lote: any) => {
  const response = await axios.put(`${API_URL}/lotes/${id}`, lote);
  return response.data;
};

export const deleteLote = async (id: string) => {
  const response = await axios.delete(`${API_URL}/lotes/${id}`);
  return response.data;
};