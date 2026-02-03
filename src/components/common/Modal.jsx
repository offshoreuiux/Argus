import React from "react";
import StatusBadge from "./StatusBadge";

function Modal({ isOpen, onClose, title, description, status, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000050] backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-[600px] max-w-full shadow-lg overflow-hidden">
        {/* Header */}
        <div
          className="flex justify-between items-start px-6 py-4"
          style={{ boxShadow: "0 4px 10px 0 #0000000D" }}
        >
          <div className="flex flex-col">
            <h2 className="text-[18px] font-bold text-[#242424]">{title}</h2>
            <div className="flex items-center gap-3">
              {description && (
                <p className="text-[14px] text-[#616161]">{description}</p>
              )}
              {status && <StatusBadge status={status} />}
            </div>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
