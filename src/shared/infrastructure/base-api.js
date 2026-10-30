import axios from "axios";
export const api = axios.create({
  baseURL:
    import.meta.env.VITE_PLATFORM_API_URL || "http://localhost:5080/api/v1",
  timeout: 90000,
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  config.headers["Accept-Language"] =
    localStorage.getItem("cete.locale") === "es_419" ? "es-419" : "en-US";
  const token = sessionStorage.getItem("cete.token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401)
      window.dispatchEvent(new Event("cete:unauthorized"));
    return Promise.reject(error);
  },
);
export const errorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.detail ||
  "The request failed. Please try again.";
export class BaseApi {
  get http() {
    return api;
  }
}
