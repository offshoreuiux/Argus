import React, { useEffect } from "react";

function Toast({ title, message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: {
      container: "bg-[#EFFFF6] border-[#1DB954] shadow-[0_4px_0_#1DB954]",
      iconBg: "bg-[#0E7A0D]",
      icon: "✓",
      text: "text-[#2E2E2E]",
      close: "text-[#0E7A0D]",
    },
    error: {
      container: "bg-[#FFF1F1] border-[#E53935] shadow-[0_4px_0_#E53935]",
      iconBg: "bg-[#E53935]",
      icon: "!",
      text: "text-[#2E2E2E]",
      close: "text-[#E53935]",
    },
  };

  const current = styles[type];

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
      <div
        className={`
          flex items-start gap-3
          w-[420px]
          p-4 rounded-lg border-2
          ${current.container}
        `}
      >
        {/* Icon */}
        <div
          className={`
            flex items-center justify-center
            w-9 h-9 rounded-md text-white text-lg font-bold
            ${current.iconBg}
          `}
        >
          {current.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-[18px] font-semibold mb-0.5">{title}</p>
          {message && <p className={`text-sm ${current.text}`}>{message}</p>}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className={`text-xl font-bold cursor-pointer leading-none ${current.close}`}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;
