'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { verifyOtp, resetRegisterState, sendOtpForChef, sendOtpForHost, sendOtpForDeliveryBoy } from '@/features/authSlice';

// Constants for timer durations
const OTP_EXPIRY_SECONDS = 5 * 60; // 5 minutes
const RESEND_COOLDOWN_SECONDS = 60; // 1 minute

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

  // Timer states
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN_SECONDS);
  const [expiryTimer, setExpiryTimer] = useState(OTP_EXPIRY_SECONDS);

  // Format seconds as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Resend cooldown countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // OTP expiry countdown
  useEffect(() => {
    if (expiryTimer <= 0) return;
    const interval = setInterval(() => {
      setExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTimer]);

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
      role: registrationData?.role,
    };

    if (registrationData?.role === 'chef') {
      payload.experience = registrationData.experience;
      payload.specializations = registrationData.specializations;
      payload.location = registrationData.location;
      payload.certificate = registrationData.certificate;
    }

    if (registrationData?.role === 'deliveryBoy') {
      payload.vehicleType = registrationData.vehicleType;
      payload.IDProof = registrationData.IDProof;
      payload.license = registrationData.license;
    }

    console.log('[VERIFY OTP] Submitting payload:', payload);
    dispatch(verifyOtp(payload));
  };

  const handleResendOtp = () => {
    if (resendTimer > 0 || !email) return;
  
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
    } else if (registrationData?.role === 'deliveryBoy') {
      const formData = new FormData();
      formData.append('name', payload.name);
      formData.append('email', payload.email);
      formData.append('phone', payload.phone);
      formData.append('password', payload.password);
      formData.append('vehicleType', payload.vehicleType);
      
      if (registrationData.IDProof instanceof File) {
        formData.append('IDProof', registrationData.IDProof);
      }
    
      if (registrationData.license instanceof File) {
        formData.append('license', registrationData.license);
      }
      dispatch(sendOtpForDeliveryBoy(formData));
    } else {
      dispatch(sendOtpForHost(payload));
    }

    // Reset timers and OTP fields
    setResendTimer(RESEND_COOLDOWN_SECONDS);
    setExpiryTimer(OTP_EXPIRY_SECONDS);
    setOtpDigits(Array(6).fill(''));
    inputRefs.current[0]?.focus();
  };

  useEffect(() => {
    if (otpVerified) {
      dispatch(resetRegisterState());
      router.push('/login');
    }
  }, [otpVerified, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#fdf7f4] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-[#f0e6e0]">
        <h2 className="text-3xl font-bold text-center text-[#d94f30] mb-8">Verify OTP</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-gray-600 text-center">
            Enter the 6-digit OTP sent to <span className="font-semibold">{email || '[MISSING EMAIL]'}</span>
          </p>

          <div className="flex justify-center gap-3">
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
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B87333] focus:border-[#B87333] text-black"
              />
            ))}
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || otpDigits.join('').length < 6}
            className="w-full bg-[#d94f30] text-white py-2 rounded-xl font-semibold hover:bg-[#a05f2a] transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {/* Resend OTP Section */}
          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            {expiryTimer > 0 ? (
              <p>OTP expires in: <span className="font-semibold">{formatTime(expiryTimer)}</span></p>
            ) : (
              <p className="text-red-600 font-semibold">OTP expired. Please resend OTP.</p>
            )}

            <button
              onClick={handleResendOtp}
              disabled={resendTimer > 0}
              className={`mt-2 px-4 py-2 rounded-md font-semibold ${
                resendTimer > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#d94f30] text-white hover:bg-[#a05f2a]'
              } transition duration-300`}
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}