import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = (): AxiosInstance => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = (user as any)?.accessToken;
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      console.log("inside res interceptor", error);
      const status = error.response?.status;
      if (status === 403) {
        navigate('/forbidden');
      }
      if (status === 401) {
        logOut()
          .then(() => {
            console.log("Logged out due to unauthorized access");
            navigate('/login');
          })
          .catch((err: Error) => {
            console.error("Error during logout:", err);
          });
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
