import axios from "axios";
import { createApiClient } from "@/src/zodios/api";
import { API_BASE_URL } from "@/config/apiConfig";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

export const apiClient = createApiClient(API_BASE_URL, { axiosInstance });
