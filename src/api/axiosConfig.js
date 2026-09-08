import axios from 'axios';
import { getAuthHeader } from './auth';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
    const authHeader = getAuthHeader();
    if (authHeader) {
        config.headers.Authorization = authHeader;
    }
    return config;
});

export default api;