"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { saveUserToDb } from "../../services/userService";

export default function LoginPage() {
  const { loginUser, googleLogin } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    setSubmitting(true);
    try {
      await loginUser(email, password);
      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Incorrect email or password");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();
      const user = result.user;

      await saveUserToDb({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "supporter",
      });

      toast.success("Logged in with Google successfully");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Google login failed");
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">Welcome back</h1>
      <p className="mb-8 text-sm text-neutral-400">Login to continue to your dashboard.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="jane@example.com"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 pr-10 outline-none focus:border-emerald-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-emerald-500 px-6 py-3 font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-neutral-500">
        <div className="h-px flex-1 bg-neutral-800" />
        OR
        <div className="h-px flex-1 bg-neutral-800" />
      </div>

      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 rounded-full border border-neutral-700 px-6 py-3 font-medium hover:border-neutral-500"
      >
        <FcGoogle size={20} /> Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-emerald-400 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}