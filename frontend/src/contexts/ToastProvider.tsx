"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastOptions = {
  title: string;
  description?: string;
  status?: "info" | "warning" | "success" | "error";
};

type ToastContextType = {
  showToast: (options: {
    title: string;
    description?: string;
    status?: "info" | "warning" | "success" | "error";
  }) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ToastOptions["status"]>("info");

  const [isShowing, setIsShowing] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = toastRef.current;
    if (!el) return;

    if (isShowing) {
      el.showPopover();
    } else {
      el.hidePopover();
    }
  }, [isShowing]);

  const showToast: ToastContextType["showToast"] = useCallback(
    ({ title, description, status }) => {
      setIsShowing((currentlyShowing) => {
        if (currentlyShowing) return true;

        setTitle(title);
        setDescription(description || "");
        setStatus(status || "info");

        setTimeout(() => {
          setIsShowing(false);
        }, 3000);

        return true;
      });
    },
    [],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        ref={toastRef}
        popover="manual"
        className={`inset-auto bottom-4 left-1/2 -translate-x-1/2 w-sm px-6 py-4 rounded shadow-lg text-white ${
          status === "success"
            ? "bg-green-500"
            : status === "error"
              ? "bg-red-500"
              : status === "warning"
                ? "bg-yellow-500"
                : "bg-blue-500"
        }`}
      >
        {<strong className="font-bold line-clamp-2">{title}</strong>}
        {description && <p className="mt-1 line-clamp-3">{description}</p>}
      </div>
    </ToastContext.Provider>
  );
}
