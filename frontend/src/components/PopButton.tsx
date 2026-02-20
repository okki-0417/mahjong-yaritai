"use client";

import { Spinner } from "@chakra-ui/react";
import { ReactNode, useState } from "react";

export type ButtonType = "button" | "submit" | "reset";

type PopButtonType = {
  value?: string | ReactNode;
  defaultClassName?: string;
  className?: string;
  onClick?: () => void;
  type?: ButtonType;
  disabled?: boolean;
  children?: ReactNode;
  isLoading?: boolean;
};

export default function PopButton({
  value,
  defaultClassName = "",
  className,
  onClick = () => null,
  type = "button",
  disabled = false,
  children,
  isLoading = false,
}: PopButtonType) {
  const [animate, setAnimate] = useState<boolean>(false);

  const handleClick = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    onClick();
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`cursor-pointer ${defaultClassName} ${className} ${animate ? "pop" : ""} hover:scale-105 transition-all p-0`}
      disabled={disabled}>
      {isLoading ? <Spinner className="sm" /> : children || value}
    </button>
  );
}
