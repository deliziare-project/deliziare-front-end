'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '@/api/axiosInstance';
import { setCurrentUser } from "@/features/authSlice";

import {
  checkEmailExists,
  resetRegisterState,
  sendOtpForHost,
  setRegistrationData,
} from "@/features/authSlice";
import { AppDispatch, RootState } from "@/redux/store";

const registerValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(2, "Name is too short"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^\d+$/, "Phone must be a number")
    .min(10, "Phone number too short")
    .required("Phone is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

type FormData = Yup.InferType<typeof registerValidationSchema>;

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, success } = useSelector((state: RootState) => state.auth);

  const [emailExists, setEmailExists] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(registerValidationSchema),
  });

  const emailValue = watch("email");

  useEffect(() => {
    if (success) {
      router.push(`/verifyotp?email=${emailValue}&role=host`);
    }
  }, [success, router, emailValue]);

  const handleEmailBlur = async () => {
    if (emailValue.trim() !== "") {
      const result = await dispatch(checkEmailExists(emailValue));
      const exists = result.payload;

      if (exists) {
        setError("email", { type: "manual", message: "Email already exists" });
        setEmailExists(true);
      } else {
        clearErrors("email");
        setEmailExists(false);
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    if (emailExists) return;

    const hostData = {
      name: data.name,
      email: data.email,
      phone: Number(data.phone),
      password: data.password,
    };

    dispatch(setRegistrationData(hostData));
    dispatch(sendOtpForHost(hostData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fef5f3] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-[#f3d9d3]">
        <h2 className="text-3xl font-bold text-center text-[#C95838] mb-6">Register as Host</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
         
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              {...register("name")}
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#C95838] focus:border-[#C95838] text-gray-600"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              {...register("email")}
              type="email"
              onBlur={handleEmailBlur}
              className={`mt-1 block w-full px-4 py-2 border text-gray-600 ${emailExists ? "border-red-500" : "border-gray-300"} rounded-xl shadow-sm focus:ring-[#C95838] focus:border-[#C95838]`}
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              {...register("phone")}
              type="tel"
              className="mt-1 block w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#C95838] focus:border-[#C95838]"
            />
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              {...register("password")}
              type="password"
              className="mt-1 block w-full text-gray-600 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#C95838] focus:border-[#C95838]"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || emailExists}
            className="w-full bg-[#C95838] text-white font-semibold py-2 px-4 rounded-xl hover:bg-[#a6462d] transition-colors disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await axiosInstance.post('/users/google', {
                  credential: credentialResponse.credential,
                  role: 'host',
                });
                
                if (res?.data?.status === true) {
                  dispatch(setCurrentUser(res.data.data));
                  router.push('/user/home');
                }
              } catch (err) {
                console.error('Google login error', err);
              }
            }}
            onError={() => console.log('Login Failed')}
            useOneTap
            width="250" 
            text="continue_with"
          />
        </div>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#C95838] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
