import "./globals.css";
import AuthProvider from "../providers/AuthProvider";
import ConditionalChrome from "../components/shared/ConditionalChrome";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "PledgeNest | Invest in People's Dreams",
  description:
    "PledgeNest is a crowdfunding platform where creators launch campaigns and supporters contribute credits to help bring them to life.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white antialiased">
        <AuthProvider>
          <ConditionalChrome>{children}</ConditionalChrome>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}