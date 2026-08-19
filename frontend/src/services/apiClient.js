import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token & Language Header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('krishiseva_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const currentLang = localStorage.getItem('krishiseva_lang') || 'en';
    config.params = {
      ...config.params,
      lang: currentLang
    };

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 Unauthorized handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('krishiseva_token');
      localStorage.removeItem('krishiseva_user');
    }
    return Promise.reject(error);
  }
);
