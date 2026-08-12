"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem("pledgenest-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let responseInterceptorAttached = false;

export default function useAxiosSecure() {
  const { logoutUser } = useAuth();
  const router = useRouter();
  const handlersRef = useRef({ logoutUser, router });
  handlersRef.current = { logoutUser, router };

  if (!responseInterceptorAttached) {
    axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          await handlersRef.current.logoutUser();
          handlersRef.current.router.push("/login");
        }
        return Promise.reject(error);
      }
    );
    responseInterceptorAttached = true;
  }

  return axiosSecure;
}