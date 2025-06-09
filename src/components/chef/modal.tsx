// components/ui/Modal.tsx
import React from 'react';

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl p-6 rounded relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-xl font-bold">&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
