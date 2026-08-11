"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// রিকোয়েস্ট পাঠানোর আগে localStorage থেকে token বসিয়ে দেওয়া হচ্ছে
axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem("pledgenest-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * useAxiosSecure()
 * প্রাইভেট/প্রোটেক্টেড API কলের জন্য এই হুক ব্যবহার করুন
 * (contribution, campaign create, withdrawal, admin action ইত্যাদি)।
 * 401/403 রেসপন্স আসলে ইউজারকে লগআউট করে লগইন পেজে পাঠিয়ে দেয়।
 */
export default function useAxiosSecure() {
  const { logoutUser } = useAuth();
  const router = useRouter();

  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        await logoutUser();
        router.push("/login");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
}
