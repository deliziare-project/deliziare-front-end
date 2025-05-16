'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { verifyOtp, resetRegisterState } from '@/features/authSlice';

export default function VerifyOtpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const { loading, error, success } = useSelector((state: RootState) => state.auth);

  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

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
    if (email && otp.length === 6) {
      dispatch(verifyOtp({ email, otp }));
    }
  };

  useEffect(() => {
    if (success) {
      alert('OTP Verified Successfully!');
      dispatch(resetRegisterState());
      router.push('/login');
    }
  }, [success, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Verify OTP</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-gray-600 text-center">
            Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
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
                ref={(el) => (inputRefs.current[index] = el!)}
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

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
