"use client";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import axios from "axios";
import { auth } from "../firebase/firebase.config";
import AuthContext from "./AuthContext";

const googleProvider = new GoogleAuthProvider();
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * AuthProvider
 * ------------
 * পুরো অ্যাপের auth state এখান থেকে ম্যানেজ হয়।
 *
 * ⚠️ গুরুত্বপূর্ণ (private route reload bug ফিক্স):
 * `loading` state টা শুরুতে `true` থাকে এবং onAuthStateChanged প্রথমবার রেসপন্স
 * না দেওয়া পর্যন্ত `false` হয় না। PrivateRoute কম্পোনেন্ট যতক্ষণ loading true,
 * ততক্ষণ redirect করবে না — শুধু loading স্পিনার দেখাবে। এতে reload করলে
 * user ভুলভাবে login পেজে ছিটকে পড়বে না, কারণ Firebase-কে session restore
 * করার জন্য সময় দেওয়া হচ্ছে।
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ইমেইল/পাসওয়ার্ড দিয়ে রেজিস্ট্রেশন
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ইমেইল/পাসওয়ার্ড দিয়ে লগইন
  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Sign-In
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // নাম ও ছবি দিয়ে Firebase প্রোফাইল আপডেট (রেজিস্ট্রেশনের পরে দরকার হয়)
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  // লগআউট — Firebase সাইনআউট + backend JWT localStorage থেকে মুছে ফেলা
  const logoutUser = () => {
    setLoading(true);
    localStorage.removeItem("pledgenest-token");
    return signOut(auth);
  };

  // Firebase auth state পরিবর্তন হলেই এটা রান হয় (লগইন/লগআউট/reload — সব ক্ষেত্রে)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        // ইউজার লগইন করা আছে — backend থেকে JWT নিয়ে localStorage এ রাখা হচ্ছে
        try {
          const res = await axios.post(`${API_URL}/jwt`, {
            email: currentUser.email,
          });
          localStorage.setItem("pledgenest-token", res.data.token);
        } catch (error) {
          console.error("JWT নেওয়া যায়নি:", error.message);
        }
      } else {
        localStorage.removeItem("pledgenest-token");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    registerUser,
    loginUser,
    googleLogin,
    updateUserProfile,
    logoutUser,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
}
