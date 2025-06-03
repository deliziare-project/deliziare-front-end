'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { verifyPasswordOtp, resendOtp } from '@/features/authSlice'; 

const OTP_EXPIRY_SECONDS = 5 * 60; 
const RESEND_COOLDOWN_SECONDS = 60; 

const PasswordResetOtp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';

  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer states
  const [resendTimer, setResendTimer] = useState(0);
  const [expiryTimer, setExpiryTimer] = useState(OTP_EXPIRY_SECONDS);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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

    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join('');

    if (otp.length < 6 || !email) return;

    const result = await dispatch(verifyPasswordOtp({ email, otp }));

    if (verifyPasswordOtp.fulfilled.match(result)) {
      router.push('/confirm-password');
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return; // prevent clicking during cooldown

    await dispatch(resendOtp( email ));
    setResendTimer(RESEND_COOLDOWN_SECONDS);
    setExpiryTimer(OTP_EXPIRY_SECONDS);
    setOtpDigits(Array(6).fill(''));
    inputRefs.current[0]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('Text').trim();
  
    if (!/^\d{6}$/.test(pastedData)) return;
  
    const digits = pastedData.split('');
    setOtpDigits(digits);
  
    // Focus the last field to indicate completion
    inputRefs.current[5]?.focus();
  };
  

  // Format seconds as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Email is missing. Please go back and enter your email.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#fdf7f4] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-[#f0e6e0]">
        <h2 className="text-3xl font-bold text-center text-[#d94f30] mb-8">Enter OTP</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otpDigits.map((digit, index) => (
              <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e)}
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
        </form>

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
      </div>
    </div>
  );
};

export default PasswordResetOtp;
