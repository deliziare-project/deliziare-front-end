// app/not-authorized/page.tsx

import React from "react";

const NotAuthorized: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500">403 - Access Denied</h1>
        <p className="mt-2">You are not authorized to view this page.</p>
      </div>
    </div>
  );
};

export default NotAuthorized;
