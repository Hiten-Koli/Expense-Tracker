import axios from "axios";


const API_URL= import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    // headers: {
    //     "Content-Type": "application/json",
    // },
});

api.interceptors.request.use(
    (config) => {
    const token = localStorage.getItem("token");
    console.log(token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response && error.response.status === 401){
            console.log(error.response.status)
            localStorage.removeItem('token')
            window.location.href=`http://localhost:5173/login/`
        }
        return Promise.reject(error)
    }
)
export default api