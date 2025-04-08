import axios from "axios";

const API_URL= import.meta.env.VITE_API_URL;

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}login/`, { email, password });
  return response.data;
};

export const registerUser = async (name: string, email: string, password: string, password2:string) => {
  const response = await axios.post(`${API_URL}register/`, { name, email, password, password2 });
  return response.data;
};
