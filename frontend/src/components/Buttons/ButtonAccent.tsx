"use client";

import PopButton, { ButtonType } from "@/src/components/PopButton";
import { ReactNode } from "react";

export default function ButtonAccent({
  type = "button",
  children = "ボタン",
  onClick,
}: {
  type?: ButtonType;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <PopButton
      type={type}
      className="bg-accent hover:bg-accent-light shadow-lg px-4 py-2 rounded text-neutral"
      onClick={() => {
        if (onClick) {
          return onClick();
        } else {
          return null;
        }
      }}>
      {children}
    </PopButton>
  );
}
