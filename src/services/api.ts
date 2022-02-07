import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: 'http://localhost:8080/v2',
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    let axiosConfig = config;

    const storagedUsername = Cookies.get('username');
    const storagedPassword = Cookies.get('password');

    if (
      storagedUsername &&
      storagedPassword &&
      window.location.pathname !== '/auth/login'
    ) {
      axiosConfig = {
        ...config,
        auth: {
          username: storagedUsername,
          password: storagedPassword,
        },
      };
    }

    return axiosConfig;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.pathname = '/auth/login';
    }
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.pathname = '/auth/login';
    }

    return Promise.reject(error);
  },
);

export default api;
