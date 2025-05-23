import api from './apiServices'
import { budgetAlert } from './budgetServices';

const API_URL= import.meta.env.VITE_API_URL;
export const fetchExpenses = async (params:string) => {
  const response = await api.get(`${API_URL}expenses/?${params}`);
  return response.data.result;
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

export const addBulkExpense = async (file:FormData)=>{
  const response = await api.post(`${API_URL}expenses/upload-file/`, file);
  return response.data
}