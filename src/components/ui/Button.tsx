import React from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

type ButtonSize = "sm" | "lg" | "default";
type ButtonVariant = "primary" | "outline" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  lg: "px-8 py-3 text-lg",
  default: "px-6 py-3",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-orange-600 text-white hover:bg-orange-700",
  outline: "bg-transparent text-white border border-white hover:bg-white/10",
  ghost: "bg-transparent hover:bg-gray-100 text-black",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      asChild = false,
      size = "default",
      variant = "primary",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={clsx(
          "rounded-full transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-semibold",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export default Button;
