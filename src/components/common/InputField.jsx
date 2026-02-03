import React from "react";

function InputField({
  label = true,
  labelTitle = "",
  required = false,
  type = "text",
  name,
  placeholder = "",
  value,
  handleChange,
  disabled = false,
  className = "",
}) {
  return (
    <div className="flex flex-col gap-1 h-full">
      {label && (
        <label className="text-sm font-medium text-[#242424]">
          {labelTitle}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full h-[46px] px-3 rounded-lg text-sm
          border border-[#E2E8EF] bg-[#F9FBFD]
          outline-none transition
          focus:border-teal-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
      />
    </div>
  );
}

export default InputField;
