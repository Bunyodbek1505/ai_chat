import { API_URL } from "@/global";
import axios, { AxiosRequestConfig, Method } from "axios";
import Cookies from "js-cookie";

export const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error?.response?.data || error);
  }
);

export const serviceApi = async <T = any>(
  method: Method,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const token = Cookies.get("token");

    const response = await API.request<T>({
      method,
      url,
      data,
      headers: {
        ...config?.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      ...config,
    });
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
