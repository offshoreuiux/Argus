import React, { useMemo, useRef } from "react";
import UploadIcon from "../../assets/images/svg/upload-file.svg";
import PdfIcon from "../../assets/images/svg/icons/PdfIcon";
import OutlinedDeleteIcon from "../../assets/images/svg/icons/OutlinedDeleteIcon";

function formatBytes(bytes = 0) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  return `${val.toFixed(2)} ${sizes[i]}`;
}

function FileUploadField({
  label = true,
  labelTitle = "",
  required = false,
  value,
  onFileSelect,
  onRemove, // ✅ add this
  accept = "",
  helperText = "",
  error = "",
}) {
  const fileInputRef = useRef(null);

  const fileSizeText = useMemo(() => formatBytes(value?.size || 0), [value]);

  const openPicker = () => fileInputRef.current?.click();

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    // allow picking same file again
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-[#242424]">
          {labelTitle}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />

      {/* ✅ UPLOADED STATE */}
      {value ? (
        <div className="mt-1 rounded-lg bg-linear-to-r from-[#314464] to-[#222648] px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Left icon */}
            <PdfIcon />

            {/* File name + size */}
            <div className="min-w-0">
              <p className="text-white font-semibold truncate">{value.name}</p>
              <p className="text-white/70 text-sm">{fileSizeText}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={openPicker}
              className="px-2 h-8 text-[14px] rounded-md cursor-pointer border border-[#0F8E81] text-[#00D1BC] hover:bg-teal-400/10 bg-[#E5FAF933] transition"
            >
              Change
            </button>

            <button
              type="button"
              onClick={onRemove}
              className="w-8 h-8 rounded-md cursor-pointer border border-[#F13E3E] text-red-400 hover:bg-red-500/10 bg-[#E4A5A54D] transition flex items-center justify-center"
              aria-label="Remove file"
              title="Remove"
            >
              <OutlinedDeleteIcon />
            </button>
          </div>
        </div>
      ) : (
        /* ✅ EMPTY / UPLOAD STATE */
        <div
          onClick={openPicker}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`
            mt-1 border-2 border-dashed rounded-lg p-6
            flex flex-col items-center justify-center text-center
            cursor-pointer transition bg-[#F9FBFD]
            ${error ? "border-red-400" : "border-[#D9D9D9] hover:border-teal-500"}
          `}
        >
          <img src={UploadIcon} alt="Upload Icon" className="mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Click to upload or drag & drop it here
          </p>

          {helperText && (
            <p className="text-xs text-gray-400 mt-1">{helperText}</p>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default FileUploadField;
