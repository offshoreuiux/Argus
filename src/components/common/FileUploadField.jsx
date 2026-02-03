import React, { useRef } from "react";
import UploadIcon from "../../assets/images/svg/upload-file.svg";

function FileUploadField({
  label = true,
  labelTitle = "",
  required = false,
  value,
  onFileSelect,
  accept = "",
  helperText = "",
  error = "",
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-[#242424]">
          {labelTitle}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        onClick={() => fileInputRef.current.click()}
        className={`
          mt-1 border-2 border-dashed rounded-lg p-6
          flex flex-col items-center justify-center text-center
          cursor-pointer transition bg-[#F9FBFD]
          ${error ? "border-red-400" : "border-[#D9D9D9] hover:border-teal-500"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onFileSelect(e.target.files[0])}
        />

        {value ? (
          <p className="text-sm text-teal-600 font-medium">{value.name}</p>
        ) : (
          <>
            <img src={UploadIcon} alt="Upload Icon" className="mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Click to upload or drag & drop it here
            </p>

            {helperText && (
              <p className="text-xs text-gray-400 mt-1">{helperText}</p>
            )}
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default FileUploadField;
