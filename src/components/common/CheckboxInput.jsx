import React from "react";

function CheckboxInput({
  label,
  checked = false,
  onChange,
  name,
  value,
  disabled = false,
  className = "",
}) {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer select-none ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
    >
      {/* Native checkbox (hidden for accessibility) */}
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />

      {/* Custom checkbox */}
      <span
        className={`w-4.5 h-4.5 rounded-[3px] flex items-center justify-center
          border
          ${
            checked
              ? "bg-[#00D1BC] border-[#00D1BC]"
              : "bg-white border-[#C7D2E0]"
          }`}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      {/* Label */}
      <span className="text-[13px] text-[#4B5563]">{label}</span>
    </label>
  );
}

export default CheckboxInput;
