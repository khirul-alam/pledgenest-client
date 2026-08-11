"use client";
import { createContext } from "react";

// AuthProvider.js এই context টা populate করবে।
// আলাদা ফাইলে রাখা হয়েছে যাতে "use client" কম্পোনেন্টে সহজে import করা যায়।
const AuthContext = createContext(null);

export default AuthContext;
