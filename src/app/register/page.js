"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import uploadImageToImgBB from "../../services/imgbbService";
import { saveUserToDb } from "../../services/userService";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const { registerUser, updateUserProfile, googleLogin } = useAuth();
  const router = useRouter();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const role = form.role.value;

    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!EMAIL_REGEX.test(email)) newErrors.email = "Please enter a valid email address";
    if (!PASSWORD_REGEX.test(password)) {
      newErrors.password =
        "Password must be at least 6 characters and include one uppercase and one lowercase letter";
    }
    if (!imageFile) newErrors.image = "Please select a profile picture";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const photoURL = await uploadImageToImgBB(imageFile);
      await registerUser(email, password);
      await updateUserProfile(name, photoURL);
      await saveUserToDb({ name, email, photoURL, role });

      toast.success("Registration successful! Welcome to PledgeNest 🎉");
      router.push("/dashboard");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrors({ email: "This email is already registered" });
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await googleLogin();
      const user = result.user;

      await saveUserToDb({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "supporter",
      });

      toast.success("Signed up with Google successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message || "Google sign-up failed");
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">Create your account</h1>
      <p className="mb-8 text-sm text-neutral-400">
        Join PledgeNest as a Supporter or Creator and get free starting credits.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Full Name</label>
          <input
            name="name"
            type="text"
            placeholder="Jane Doe"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Email</label>
          <input
            name="email"
            type="email"
            placeholder="jane@example.com"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-emerald-500 file:px-3 file:py-1 file:text-neutral-950"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-16 w-16 rounded-full object-cover ring-2 ring-emerald-400"
            />
          )}
          {errors.image && <p className="mt-1 text-xs text-red-400">{errors.image}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
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
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">I want to join as</label>
          <select
            name="role"
            defaultValue="supporter"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400"
          >
            <option value="supporter">Supporter — back campaigns (50 free credits)</option>
            <option value="creator">Creator — launch campaigns (20 free credits)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-emerald-500 px-6 py-3 font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-neutral-500">
        <div className="h-px flex-1 bg-neutral-800" />
        OR
        <div className="h-px flex-1 bg-neutral-800" />
      </div>

      <button
        onClick={handleGoogleSignUp}
        className="flex items-center justify-center gap-2 rounded-full border border-neutral-700 px-6 py-3 font-medium hover:border-neutral-500"
      >
        <FcGoogle size={20} /> Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-400 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}