import api from './apiServices'

const API_URL= import.meta.env.VITE_API_URL;
export const fetchIncomes = async (params:string) => {
  const response = await api.get(`${API_URL}incomes/?${params}`);
  return response.data.result;
};

export const addIncome = async (data:any) => {
  const response = await api.post(`${API_URL}incomes/`, data );
  return response.data;
};

export const deleteIncome = async (id:number) => {
    await api.delete(`${API_URL}incomes/${id}/`);
};

export const updateIncome = async (id:number, data:any) => {
  const response = await api.put(`${API_URL}incomes/${id}/`, data);
  return response.data;
};