// "use client";
// import React, { forwardRef } from "react";

// interface InputBoxProps {
//   label?: string;
//   type?: string;
//   placeholder?: string;
//   name?: string;
//   required?: boolean;
// }

// const InputBox = forwardRef<HTMLInputElement, InputBoxProps>(
//   ({ label, type = "text", placeholder, name, required = false }, ref) => {
//     return (
//       <div className="flex flex-col mb-4">
//         {label && (
//           <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
//         )}
//         <input
//           ref={ref}
//           type={type}
//           name={name}
//           required={required}
//           placeholder={placeholder}
//           className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
//         />
//       </div>
//     );
//   }
// );

// InputBox.displayName = "InputBox";
// export default InputBox;

"use client";
import React from "react";
import { UseFormRegister, RegisterOptions } from "react-hook-form";

interface InputBoxProps {
  label?: string;
  type?: string;
  placeholder?: string;
  name: string;
  required?: boolean;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
}

const InputBox: React.FC<InputBoxProps> = ({
  label,
  type = "text",
  placeholder,
  name,
  required = false,
  register,
  registerOptions = {},
}) => {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        {...register(name, registerOptions)}
         min={new Date().toISOString().split('T')[0]}
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
};

export default InputBox;
