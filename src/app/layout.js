import "./globals.css";
import AuthProvider from "../providers/AuthProvider";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../components/shared/ScrollToTop";

export const metadata = {
  title: "PledgeNest | Invest in People's Dreams",
  description:
    "PledgeNest is a crowdfunding platform where creators launch campaigns and supporters contribute credits to help bring them to life.",
  openGraph: {
    title: "PledgeNest",
    description: "Back the campaigns you believe in, or launch your own.",
    type: "website",
  },
  themeColor: "#10b981",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white antialiased">
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
