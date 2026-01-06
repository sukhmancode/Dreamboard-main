"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant:"primary" | "outlined"
  className?: string;
  appName: string;
}

export const Button = ({ size,variant,className }: ButtonProps) => {
  return (
    <button
      className={`${className} ${variant === "primary" ? "bg-primary" : "outlined"}`}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
