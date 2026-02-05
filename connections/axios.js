import axios from "axios";
import { ip } from "../config/ip";

export const apiURL = axios.create({
  baseURL: `${ip}api/v1/`,
});

// Interceptor
apiURL.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  },
);

export function redirectToLogin() {
  window.location.href = "/";
}

export const BaseURL = ip;
