import React from "react";

function PrimaryButton({
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
        px-5 py-2 rounded-lg text-base font-medium
        transition 
        ${
          disabled || loading
            ? "bg-teal-300 text-gray-500 cursor-not-allowed"
            : "bg-[#00D1BC] text-white cursor-pointer hover:bg-teal-600"
        }
        ${className}
      `}
      style={{ boxShadow: "0 0 22px 0 #00D1BC66" }}
      {...rest}
    >
      {loading ? "Uploading..." : children}
    </button>
  );
}

export default PrimaryButton;
