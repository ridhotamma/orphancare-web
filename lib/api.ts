import axios, { AxiosRequestConfig, AxiosInstance, AxiosError } from 'axios';
import cookieStorage from './storage/cookies';

// const baseURL = process.env.NEXT_PUBLIC_API_URL;
const baseURL = 'https://personwithai.my.id/orphancare/api';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
  });

  instance.interceptors.request.use(async (config) => {
    const authToken = cookieStorage.getItem('authToken');
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  });

  return instance;
};

const axiosInstance = createAxiosInstance();

interface ServiceProps extends AxiosRequestConfig {
  url: string;
}

export const requests = async ({
  url,
  method = 'GET',
  data,
  params,
  headers,
}: ServiceProps) => {
  try {
    const response = await axiosInstance({
      url,
      method,
      data,
      params,
      headers,
    });
    return response.data;
  } catch (error: any) {
    const errorObject = error as AxiosError;
    if (error.status === 401) {
      document.dispatchEvent(new Event('session-expired'));
      return {
        data: null,
        error: errorObject.response?.data || 'Unauthorized',
        status: 401,
      };
    }
    throw errorObject.response?.data;
  }
};
