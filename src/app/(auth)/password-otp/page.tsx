'use client';

import React, { Suspense } from 'react';
import PasswordResetOtp from '@/components/auth/PasswordResetOtp';
import AuthWrapper from '@/components/AuthWrapper';

function Page() {
  return (
    <AuthWrapper routeType="public">
      <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
        <PasswordResetOtp />
      </Suspense>
    </AuthWrapper>
  );
}

export default Page;
