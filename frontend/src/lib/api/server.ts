import { API_BASE_URL } from "@/config/apiConfig";
import { createApiClient } from "@/src/zodios/api";
import axios from "axios";
import { cookies } from "next/headers";

const createApiPageClient = async () => {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      Cookie: cookieHeader,
      Accept: "application/json",
    },
  });

  return createApiClient(API_BASE_URL, {
    axiosInstance: instance,
  });
};

export default createApiPageClient;
