import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
})=>{
  return(
    <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    
    >{children}</button>
  )
}
export default Button;
