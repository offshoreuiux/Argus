import React from "react";

function TextareaField({
  label = true,
  labelTitle = "",
  required = false,
  name,
  placeholder = "",
  value,
  handleChange,
  rows = 4,
  disabled = false,
  className = "",
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-[#242424]">
          {labelTitle}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`
          w-full px-3 py-2 rounded-lg text-sm resize-none
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

export default TextareaField;
