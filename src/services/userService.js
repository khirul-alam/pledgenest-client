import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * saveUserToDb()
 * --------------
 * Firebase এ registration/Google sign-in সফল হওয়ার পর backend এর /users
 * রুটে ইউজার ইনফো পাঠায়। Backend এ email আগে থেকে থাকলে duplicate insert
 * হবে না (authRoutes.js এ সেই চেক করা আছে) — তাই Google login এও নিরাপদে
 * বারবার কল করা যায়।
 */
export async function saveUserToDb({ name, email, photoURL, role }) {
  const res = await axios.post(`${API_URL}/users`, { name, email, photoURL, role });
  return res.data;
}