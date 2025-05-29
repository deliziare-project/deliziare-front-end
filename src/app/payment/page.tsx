'use client';

import React, { useEffect } from 'react';
import PaymentForm from '@/components/payment/paymentForm';

function PaymentPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Clean up when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <PaymentForm />
    </div>
  );
}

export default PaymentPage;
