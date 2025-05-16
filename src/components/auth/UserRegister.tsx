'use client';

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { registerHost, resetRegisterState ,sendOtpForHost,setRegistrationData,checkEmailExists} from "@/features/authSlice";
import { useRouter } from 'next/navigation';
import * as Yup from "yup";
import { registerValidationSchema } from "../validation/formValidation";

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

  const [emailExists, setEmailExists] = useState(false);
 const [formErrors, setFormErrors] = useState<Record<string, string>>({});

const validateField = async (name: string, value: string) => {
  try {
    await (Yup.reach(registerValidationSchema, name) as Yup.StringSchema).validate(value);

    setFormErrors(prev => ({ ...prev, [name]: "" }));
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      setFormErrors(prev => ({ ...prev, [name]: err.message }));
    }
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Clear email exists error on email change
    if (e.target.name === "email") {
      setEmailExists(false);
    }
  };

  const handleEmailBlur = async () => {
    if (form.email.trim() !== "") {
      const result = await dispatch(checkEmailExists(form.email));
      const exists = result.payload;
      setEmailExists(exists);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailExists) return;

    const hostData = {
      name: form.name,
      email: form.email,
      phone: Number(form.phone),
      password: form.password,
    };

   // dispatch(registerHost(hostData));
    dispatch(setRegistrationData(hostData));
    dispatch(sendOtpForHost(hostData));
    
    
  };
  

  useEffect(() => {
    if (success) {
      router.push(`/verifyotp?email=${form.email}&role=host`);
      dispatch(resetRegisterState());
    }

  }, [success]);
  


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register as Host</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
               onBlur={(e) => validateField("name", e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {formErrors.name && (
              <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
             onBlur={async (e) => {
                await validateField("email", e.target.value);
                handleEmailBlur();
              }}
              required
              className={`mt-1 block w-full px-4 py-2 border ${emailExists ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {formErrors.email && (
              <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
            )}
            {emailExists && (
              <p className="text-sm text-red-600 mt-1">Email already exists. Please use a different one.</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              onBlur={(e) => validateField("phone", e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {formErrors.phone && (
              <p className="text-sm text-red-600 mt-1">{formErrors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onBlur={(e) => validateField("password", e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {formErrors.password && (
              <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || emailExists}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Global Error Message */}
          {error && (
            <p className="text-sm text-red-600 mt-2 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
