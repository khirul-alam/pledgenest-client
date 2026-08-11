import Link from "next/link";
import { FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center">
        <Link href="/" className="text-lg font-bold text-white">
          Pledge<span className="text-emerald-400">Nest</span>
        </Link>
        <p className="max-w-md text-sm text-neutral-400">
          মানুষের স্বপ্ন আর দরকারি প্রজেক্টগুলোকে একসাথে যুক্ত করছি সাপোর্টারদের সাথে —
          একটা সময়ে একটা পলেজ।
        </p>
        <div className="flex gap-4 text-xl text-neutral-400">
          <a href="https://facebook.com/your-profile" target="_blank" rel="noreferrer" className="hover:text-emerald-400">
            <FaFacebook />
          </a>
          <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noreferrer" className="hover:text-emerald-400">
            <FaLinkedin />
          </a>
          <a href="https://github.com/your-username" target="_blank" rel="noreferrer" className="hover:text-emerald-400">
            <FaGithub />
          </a>
        </div>
        <p className="text-xs text-neutral-600">
          © {new Date().getFullYear()} PledgeNest. সর্বস্বত্ব সংরক্ষিত।
        </p>
      </div>
    </footer>
  );
}
