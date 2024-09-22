import axios, { AxiosRequestConfig } from 'axios';

const API_URLS = {
  development: 'https://jsonplaceholder.typicode.com',
  staging: 'https://staging-api.example.com',
  production: 'https://api.example.com',
};

const env = process.env.NODE_ENV || 'development';
const baseURL = API_URLS[env as keyof typeof API_URLS];

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};
