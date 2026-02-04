import React from "react";

function RadioInput({
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
      className={`flex items-center gap-2 cursor-pointer select-none ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
    >
      {/* Custom radio */}
      <span
        className={`w-4 h-4 rounded-full border flex items-center justify-center
          ${checked ? "border-[#00D1BC]" : "border-[#D1D5DB]"}
        `}
      >
        {checked && <span className="w-2 h-2 rounded-full bg-[#00D1BC]" />}
      </span>

      {/* Label */}
      <span className="text-sm text-[#6B7280]">{label}</span>

      {/* Native input (hidden, for accessibility & forms) */}
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}

export default RadioInput;
