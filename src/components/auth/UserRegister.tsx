'use client';

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  registerHost,
  resetRegisterState,
  sendOtpForHost,
  setRegistrationData,
} from "@/features/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hostData = {
      name: form.name,
      email: form.email,
      phone: Number(form.phone),
      password: form.password,
    };
    dispatch(setRegistrationData(hostData));
    dispatch(sendOtpForHost(hostData));
  };

  useEffect(() => {
    if (success) {
      router.push(`/verifyotp?email=${form.email}&role=host`);
      //dispatch(resetRegisterState());
    }
  }, [success]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-[#213D72] mb-6">Register as Host</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#213D72] focus:border-[#213D72]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#213D72] focus:border-[#213D72]"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#213D72] focus:border-[#213D72]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#213D72] focus:border-[#213D72]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#213D72] text-white font-semibold py-2 px-4 rounded-xl hover:bg-[#1a2f5c] transition-colors disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {error && (
            <p className="text-sm text-red-600 mt-2 text-center">{error}</p>
          )}
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#213D72] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
