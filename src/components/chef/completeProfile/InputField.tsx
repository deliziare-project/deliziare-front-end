'use client'

import { useState } from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  placeholder?: string;
  error?: string; 
  max?: number;
}

const InputField = ({ label, name, value, onChange, type, placeholder,max, error }: InputFieldProps) => {
    const [localError, setLocalError] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (type === 'number' && max !== undefined) {
      const numValue = parseInt(val);
      if (!isNaN(numValue) && numValue > max) {
        setLocalError(`Value cannot exceed ${max}`);
        return; 
        setLocalError('');
      }
    }

    onChange(e);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
        max={max}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
          error ||localError ? 'border-red-500' : 'border-gray-300'
        }`}
      />
       {(error || localError) && (
        <p className="mt-1 text-sm text-red-500">{error || localError}</p>
      )}
    </div>
  );
};

export default InputField;
