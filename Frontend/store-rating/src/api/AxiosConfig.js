import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Outbound request interceptor to auto-inject the JWT Bearer Token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// THIS LINE WAS LIKELY MISSING OR MISFORMATTED:
export default API;