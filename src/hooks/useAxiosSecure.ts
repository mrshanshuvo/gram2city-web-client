import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../features/auth/authStore";
import { useNavigate } from "react-router";
import React from "react";

const axiosSecure: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = (): AxiosInstance => {
  const { user, logout: logOut } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Request Interceptor
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (user) {
          const token = await user.getIdToken();
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        console.log("inside res interceptor", error);
        const status = error.response?.status;
        if (status === 403) {
          navigate("/forbidden");
        }
        if (status === 401) {
          logOut()
            .then(() => {
              console.log("Logged out due to unauthorized access");
              navigate("/login");
            })
            .catch((err: Error) => {
              console.error("Error during logout:", err);
            });
        }
        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
