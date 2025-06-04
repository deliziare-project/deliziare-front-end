
import { Toaster } from 'react-hot-toast';
import type { ToasterProps } from 'react-hot-toast';

// Only if you want to wrap children in future
interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#fff',
            color: '#333',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#e0f7e9',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffe4e6',
            },
          },
        }}
      />
      {children}
    </>
  );
};


export default ToastProvider;
