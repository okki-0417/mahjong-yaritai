"use client";

import { useEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  minWidth?: string | number;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  width,
  height,
  maxWidth,
  minWidth,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (isOpen) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!ref.current) return;
    if (e.target !== ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      onClose();
    }
  };

  return (
    <dialog
      ref={ref}
      className="bg-neutral backdrop:bg-black/30 m-auto rounded p-4 z-40"
      style={{
        width: width || "90%",
        maxWidth: maxWidth || "500px",
        minWidth: minWidth || "200px",
        height: height || "80vh",
      }}
      onCancel={onClose}
      onClick={handleBackdropClick}
    >
      {children}
    </dialog>
  );
}
