import axios from "axios";

const API = axios.create({
  baseURL: "http://94.74.86.174:8080/api",
  timeout: 10000, // 10 second timeout
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    console.log('🚀 Making request to:', config.baseURL + config.url);
    
    const token = localStorage.getItem("token");
    
    // Daftar endpoint yang tidak memerlukan auth
    const noAuthNeeded = ['/login', '/register'];
    const isAuthRequired = !noAuthNeeded.some((path) => 
      config.url.includes(path)
    );

    if (token && isAuthRequired) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token ditambahkan ke header');
    }

    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    
    // Jika token expired atau unauthorized
    if (error.response?.status === 401) {
      console.log('🔒 Token expired atau tidak valid, menghapus token...');
      localStorage.removeItem('token');
      
      // Redirect ke login
      if (!error.config?.url?.includes('/login') && 
          !error.config?.url?.includes('/register')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;