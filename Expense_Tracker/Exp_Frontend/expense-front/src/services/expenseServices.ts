import api from './apiServices'
import { budgetAlert } from './budgetServices';

const API_URL= import.meta.env.VITE_API_URL;
export const fetchExpenses = async () => {
  const response = await api.get(`${API_URL}expenses/`);
  console.log(response.data);
  return response.data;
};

export const addExpense = async (data:any) => {
  const response = await api.post(`${API_URL}expenses/`, data );
  budgetAlert()
  return response.data;
};

export const deleteExpense = async (id:number) => {
    await api.delete(`${API_URL}expenses/${id}/`);
};

export const updateExpense = async (id:number, data:any) => {
  const response = await api.put(`${API_URL}expenses/${id}/`, data);
  return response.data;
};