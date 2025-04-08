import api from './apiServices'

const API_URL= import.meta.env.VITE_API_URL;
export const fetchIncomes = async () => {
  const response = await api.get(`${API_URL}incomes/`);
  console.log(response.data);
  return response.data;
};

export const addIncome = async (data:any) => {
  console.log(data)
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