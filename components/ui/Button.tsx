"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "text-white hover:opacity-90 active:scale-95",
    secondary:
      "border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95",
    danger:
      "text-red-600 border border-red-200 hover:bg-red-50 active:scale-95",
    ghost:
      "text-gray-500 hover:bg-gray-100 active:scale-95",
  };

  const primaryStyle =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, #6366f1, #818cf8)",
          boxShadow: "0 4px 15px rgba(99,102,241,0.35)",
        }
      : {};

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      style={primaryStyle}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
