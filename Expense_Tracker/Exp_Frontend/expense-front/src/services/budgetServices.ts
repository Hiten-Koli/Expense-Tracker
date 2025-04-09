import api from './apiServices'

const API_URL= import.meta.env.VITE_API_URL;
export const fetchBudgets = async () => {
  const response = await api.get(`${API_URL}budgets/`);
  console.log(response.data);
  return response.data;
};

export const addBudget = async (data:any) => {
  console.log(data)
  const response = await api.post(`${API_URL}budgets/`, data );
  return response.data;
};

export const deleteBudget = async (id:number) => {
    await api.delete(`${API_URL}budgets/${id}/`);
};

export const updateBudget = async (id:number, data:any) => {
  const response = await api.put(`${API_URL}budgets/${id}/`, data);
  return response.data;
};