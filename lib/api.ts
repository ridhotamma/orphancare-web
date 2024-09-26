import axios, { AxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL

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
