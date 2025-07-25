import axios from 'axios';


const axiosInstance = axios.create({
    // baseURL: 'http://localhost:5000/api/',
    baseURL: 'https://mshru-kasim.vercel.app/api',
    withCredentials: true,
});

// ✅ إضافة التوكن تلقائيًا في كل طلب
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log("Token in axios interceptor:", token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
