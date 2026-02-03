import React from "react";

function OutlinedButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  loading = false,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-4 py-2 rounded-lg border text-base font-semibold
        transition
        ${
          disabled || loading
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-[#D4D4D4] text-[#616161] hover:bg-gray-50"
        }
        ${className}
      `}
      {...rest}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default OutlinedButton;
