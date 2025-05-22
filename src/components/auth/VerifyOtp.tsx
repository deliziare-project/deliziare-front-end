'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { verifyOtp, resetRegisterState, sendOtpForChef, sendOtpForHost, sendOtpForDeliveryBoy } from '@/features/authSlice';

export default function VerifyOtpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryEmail = searchParams.get('email');
  const registrationData = useSelector((state: RootState) => state.auth.registrationData);
  const email = queryEmail || registrationData?.email || '';

  const { loading, error, otpVerified } = useSelector((state: RootState) => state.auth);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log('[VERIFY OTP PAGE] email from URL:', queryEmail);
    console.log('[VERIFY OTP PAGE] email from registrationData:', registrationData?.email);
    console.log('[VERIFY OTP PAGE] final resolved email:', email);
    console.log('[VERIFY OTP PAGE] registrationData:', registrationData);
  }, [queryEmail, registrationData, email]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otpDigits];
    updatedOtp[index] = value;
    setOtpDigits(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const updatedOtp = [...otpDigits];
      updatedOtp[index - 1] = '';
      setOtpDigits(updatedOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (!email || otp.length !== 6 || otpDigits.some(d => !/^\d$/.test(d))) {
      alert('Please enter all 6 numeric digits of the OTP');
      return;
    }

    const payload: any = {
      email,
      otp,
      name: registrationData?.name,
      password: registrationData?.password,
      phone: registrationData?.phone,
      role: registrationData?.role ,
    };

    if (registrationData?.role === 'chef') {
      payload.experience = registrationData.experience;
      payload.specializations = registrationData.specializations;
      payload.location = registrationData.location;
      payload.certificate = registrationData.certificate;
    }

    if(registrationData?.role === 'deliveryBoy'){
      payload.vehicleType = registrationData.vehicleType;
      payload.IDProof = registrationData.IDProof;
      payload.license = registrationData.license;
    }

    console.log('[VERIFY OTP] Submitting payload:', payload);
    dispatch(verifyOtp(payload));
  };

  const handleResendOtp = () => {
    if (!email) return;
  
    const payload: any = {
      name: registrationData?.name,
      email: registrationData?.email,
      password: registrationData?.password,
      phone: registrationData?.phone,
      role: registrationData?.role || 'host',
    };
  
    if (registrationData?.role === 'chef') {
      const formData = new FormData();
      formData.append('name', payload.name);
      formData.append('email', payload.email);
      formData.append('phone', payload.phone);
      formData.append('password', payload.password);
      formData.append('experience', registrationData.experience);
      formData.append('specialize', JSON.stringify(registrationData.specializations));
      formData.append('locationLat', registrationData.location.lat.toString());
      formData.append('locationLng', registrationData.location.lng.toString());
      formData.append('role', 'chef');
     
      if (registrationData.certificate) {
        formData.append('certificate', registrationData.certificate);
      }
      dispatch(sendOtpForChef(formData));
    } 

    else if(registrationData?.role === 'deliveryBoy'){
      const formData = new FormData();
      formData.append('name', payload.name);
      formData.append('email', payload.email);
      formData.append('phone', payload.phone);
      formData.append('password', payload.password);
      formData.append('vehicleType',payload.vehicleType);
      console.log(registrationData.IDProof instanceof File); 
      console.log(registrationData.license instanceof File); 

      if (registrationData.IDProof instanceof File) {
        formData.append('IDProof', registrationData.IDProof);
      }
    
      if (registrationData.license instanceof File) {
        formData.append('license', registrationData.license);
      }
      dispatch(sendOtpForDeliveryBoy(formData))
    }
    else {
      dispatch(sendOtpForHost(payload));
    }
    
  };

  

  useEffect(() => {
    if (otpVerified) {
      dispatch(resetRegisterState());
      router.push('/login');
    }
  }, [otpVerified, dispatch, router]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Verify OTP</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-gray-600 text-center">
            Enter the 6-digit OTP sent to <span className="font-semibold">{email || '[MISSING EMAIL]'}</span>
          </p>

          <div className="flex justify-between gap-2">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => { inputRefs.current[index] = el!; }}
                className="w-12 h-14 text-2xl text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="text-center mt-4 space-y-2">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>
            <button
              type="button"
              disabled={!canResend}
              onClick={handleResendOtp}
              className="text-blue-600 font-medium hover:underline disabled:opacity-50"
            >
              Resend OTP {resendTimer > 0 && `(${resendTimer}s)`}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
