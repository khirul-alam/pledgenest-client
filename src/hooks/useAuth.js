"use client";
import { useContext } from "react";
import AuthContext from "../providers/AuthContext";

/**
 * useAuth()
 * প্রতিটা কম্পোনেন্টে বারবার useContext(AuthContext) লেখার বদলে
 * শুধু useAuth() কল করলেই { user, loading, ... } পাওয়া যাবে।
 */
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth অবশ্যই AuthProvider এর ভেতরে ব্যবহার করতে হবে");
  }
  return context;
}
