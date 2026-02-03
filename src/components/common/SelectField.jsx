import React from "react";

function SelectField({
  label = true,
  labelTitle = "",
  required = false,
  name,
  value,
  handleChange,
  options = [],
  placeholder = "Select option",
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

      <select
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-full h-[46px] px-3 rounded-lg text-sm
          border border-[#E2E8EF] bg-[#F9FBFD]
          outline-none transition
          focus:border-teal-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
      >
        <option value="">{placeholder}</option>

        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;
