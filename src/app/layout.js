import "./globals.css";
import AuthProvider from "../providers/AuthProvider";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "PledgeNest | মানুষের স্বপ্নে বিনিয়োগ করুন",
  description:
    "PledgeNest একটা crowdfunding প্ল্যাটফর্ম যেখানে ক্রিয়েটররা ক্যাম্পেইন চালু করে আর সাপোর্টাররা ক্রেডিট দিয়ে সেগুলোকে বাস্তবে রূপ দিতে সাহায্য করে।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className="bg-neutral-950 text-white antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
