import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000, // 10 seconds
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Network error'));
    }
    return Promise.reject(error);
  }
);

export default instance;