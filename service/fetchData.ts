import axios, { AxiosRequestConfig } from "axios";
import { AI_API_URL, API_KEY } from "../global";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: AI_API_URL,
});

export const fetchData = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  options?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await API({
      url,
      method,
      params: method === "GET" ? data : undefined,
      data: method !== "GET" ? data : undefined,
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
        ...options?.headers,
      },
      ...options,
    });

    if (response?.data?.message) {
      toast.success(response.data.message);
    }

    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);

    const errorMessage =
      error.response?.data?.message || error.message || "Xatolik yuz berdi";
    toast.error(errorMessage);

    throw error;
  }
};
