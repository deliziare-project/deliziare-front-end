"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { loginUser, checkCurrentUser } from "../../features/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/api/axiosInstance";
import { GoogleLogin } from "@react-oauth/google";
import { Skeleton } from "../loaders/Skeleton";
import { Eye, EyeOff, Mail, Lock, ChefHat } from "lucide-react";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, success, registrationData } = useAppSelector(
    (state: any) => state.auth
  );

  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const email = watch("email");

  useEffect(() => {
    const checkGoogleUser = async () => {
      if (!email) return;
      try {
        const res = await axiosInstance.post("/users/check-google-user", {
          email,
        });
        setIsGoogleUser(res.data?.isGoogleUser ?? false);
        setUserRole(res.data?.role ?? null);
      } catch (err) {
        setIsGoogleUser(false);
        setUserRole(null);
      }
    };
    checkGoogleUser();
  }, [email]);

  const onSubmit = (data: LoginFormInputs) => {
    dispatch(loginUser({ email: data.email, password: data.password }));
  };

  const redirectBasedOnRole = (role: string | null) => {
    switch (role) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "host":
        router.push("/user/home");
        break;
      case "chef":
        router.push("/chef/home");
        break;
      case "deliveryBoy":
        router.push("/deliveryBoy/welcome");
        break;
      default:
        router.push("/");
    }
  };

  useEffect(() => {
    const user = registrationData?.user;
    if (success && user&&!loading) {
      redirectBasedOnRole(user.role);
    }
  }, [success, registrationData,loading]);

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 bg-[linear-gradient(to_right,#EFF3EA,#FAF6E9,#FFFDF6)]"

    >
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0 ">
        <Image
          src="/images/login-bg.png" // Add your image to public/images/
          alt="Background"
          fill
          className="object-cover "
          priority
        />
        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black/5"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-light text-[#27391C] mb-2 drop-shadow-lg">
            Welcome Back
          </h2>
          <p className="text-[#526E48] text-sm drop-shadow">
            Please sign in to your account
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white/25 backdrop-blur rounded-xl shadow-2xl border border-white/20 p-8">
          {loading ? (
            <div className="space-y-4">
              <Skeleton />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-900" />
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-900" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-600 placeholder-gray-400 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4 text-[#D5451B]" />
                    ) : (
                      <EyeOff className="w-4 h-4 " />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link href="/forgot-password">
                  <span className="text-sm text-[#27391C] hover:text-[#526E48] transition-colors cursor-pointer">
                    Forgot Password?
                  </span>
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50/90 backdrop-blur-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className="w-full bg-[#526E48] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#27391C] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>

              {/* Google Login */}
              {isGoogleUser && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        try {
                          const res = await axiosInstance.post(
                            "/users/google",
                            {
                              credential: credentialResponse.credential,
                              role: userRole,
                            }
                          );

                          if (res?.data?.status === true) {
                            dispatch(checkCurrentUser());
                            const user = res.data.data;
                            redirectBasedOnRole(user?.role || "host");
                          }
                        } catch (err) {
                          console.error("Google login error", err);
                        }
                      }}
                      onError={() => console.log("Google Login Failed")}
                      useOneTap
                      width="100%"
                      text="continue_with"
                      theme="outline"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 drop-shadow">
            Don&apos;t have an account?{" "}
            <Link href="/register">
              <span className="text-[#27391C] hover:text-[#526E48] font-medium cursor-pointer underline decoration-white/50 hover:decoration-white/80 transition-all">
                Sign Up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { useAppDispatch, useAppSelector } from '../../redux/store';
// import { loginUser, checkCurrentUser } from '../../features/authSlice';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import Image from 'next/image';
// import axiosInstance from '@/api/axiosInstance';
// import { GoogleLogin } from '@react-oauth/google';
// import { Skeleton } from '../loaders/Skeleton';

// const schema = yup.object().shape({
//   email: yup.string().email('Invalid email format').required('Email is required'),
//   password: yup.string().required('Password is required'),
// });

// interface LoginFormInputs {
//   email: string;
//   password: string;
// }

// const Login: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const { loading, error, success, registrationData } = useAppSelector((state: any) => state.auth);

//   const [isGoogleUser, setIsGoogleUser] = useState(false);
//   const [userRole, setUserRole] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<LoginFormInputs>({
//     resolver: yupResolver(schema),
//   });

//   const email = watch('email');

//   useEffect(() => {
//     const checkGoogleUser = async () => {
//       if (!email) return;
//       try {
//         const res = await axiosInstance.post('/users/check-google-user', { email });
//         setIsGoogleUser(res.data?.isGoogleUser ?? false);
//         setUserRole(res.data?.role ?? null);
//       } catch (err) {
//         setIsGoogleUser(false);
//         setUserRole(null);
//       }
//     };
//     checkGoogleUser();
//   }, [email]);

//   const onSubmit = (data: LoginFormInputs) => {
//     dispatch(loginUser({ email: data.email, password: data.password }));
//   };

//   const redirectBasedOnRole = (role: string | null) => {
//     switch (role) {
//       case 'admin':
//         router.push('/admin/dashboard');
//         break;
//       case 'host':
//         router.push('/user/home');
//         break;
//       case 'chef':
//         router.push('/chef/home');
//         break;
//       case 'deliveryBoy':
//         router.push('/deliveryBoy/welcome');
//         break;
//       default:
//         router.push('/');
//     }
//   };

//   useEffect(() => {
//     const user = registrationData?.user;
//     if (success && user) {

//       redirectBasedOnRole(user.role);

//     }
//   }, [success, registrationData]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#fdf7f4] px-4">
//       <div className="flex max-w-4xl w-full bg-white rounded-2xl shadow-2xl border border-[#f0e6e0] overflow-hidden">
//         <div className="hidden md:block md:w-1/2">
//           <Image
//             src="/authImages/login.png"
//             alt="Login Illustration"
//             width={400}
//             height={400}
//             className="object-cover"
//           />
//         </div>

//         <div className="w-full md:w-1/2 p-10">
//         <h2 className="text-3xl font-bold text-center text-[#d94f30]">Welcome Back</h2>
//         <p className="text-sm text-center text-gray-600 mb-8">Please sign in to your account</p>

//         {loading ? (
//           <Skeleton/>
//           ) : (
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email</label>
//                 <input
//                   id="email"
//                   type="email"
//                   {...register('email')}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#B87333] focus:border-[#B87333] text-black"
//                 />
//                 {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-800">Password</label>
//                 <input
//                   id="password"
//                   type="password"
//                   {...register('password')}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-[#B87333] focus:border-[#B87333] text-black"
//                 />
//                 {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
//                 <div className="flex justify-end mt-1">
//                   <Link href="/forgot-password">
//                     <span className="text-sm text-[#B87333] hover:underline cursor-pointer font-medium">
//                       Forgot Password?
//                     </span>
//                   </Link>
//                 </div>
//               </div>

//               {isGoogleUser && (
//                 <div className="w-full">
//                   <div className="flex items-center my-4">
//                     <hr className="flex-grow border-t border-gray-300" />
//                     <span className="mx-3 text-sm text-gray-500">OR</span>
//                     <hr className="flex-grow border-t border-gray-300" />
//                   </div>

//                   <GoogleLogin
//                     onSuccess={async (credentialResponse) => {
//                       try {
//                         const res = await axiosInstance.post('/users/google', {
//                           credential: credentialResponse.credential,
//                           role: userRole,
//                         });

//                         if (res?.data?.status === true) {
//                           dispatch(checkCurrentUser());
//                           const user = res.data.data;
//                           redirectBasedOnRole(user?.role || 'host');
//                         }
//                       } catch (err) {
//                         console.error('Google login error', err);
//                       }
//                     }}
//                     onError={() => console.log('Google Login Failed')}
//                     useOneTap
//                     width="365"
//                     text="continue_with"
//                   />
//                 </div>
//               )}

//               {error && <p className="text-red-600 text-sm">{error}</p>}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-[#d94f30] text-white py-2 rounded-xl font-semibold hover:bg-[#a05f2a] transition duration-300 disabled:opacity-50"
//               >
//                 Login
//               </button>
//             </form>
//           )}

//           <p className="mt-6 text-sm text-center text-gray-600">
//             Don&apos;t have an account?{' '}
//             <Link href="/register">
//               <span className="text-[#B87333] hover:underline font-medium">Sign Up</span>
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
