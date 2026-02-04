import React, { useState } from "react";

export default function Accordion({
  items = [],
  defaultOpenId = null,
  allowMultiple = false,
  className = "",
}) {
  const [openIds, setOpenIds] = useState(defaultOpenId ? [defaultOpenId] : []);

  const isOpen = (id) => openIds.includes(id);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const opened = prev.includes(id);
      if (allowMultiple)
        return opened ? prev.filter((x) => x !== id) : [...prev, id];
      return opened ? [] : [id];
    });
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {items.map((item) => {
        const open = isOpen(item.id);

        return (
          <div
            key={item.id}
            className="bg-white border border-[#E2E8EF] rounded-lg overflow-hidden"
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className={`w-full flex items-center justify-between px-4 cursor-pointer py-3 text-left ${open ? "bg-[#E3EDF9]" : ""}`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="mt-[2px]">{item.leftIcon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="text-[14px] font-medium text-[#03AF9E]">
                      {item.code}
                    </span>
                    <span className="text-[14px] text-[#7E7E7E]">
                      {item.meta}
                    </span>
                  </div>

                  <p className="text-[16px] font-medium text-[#242424] mt-1 truncate">
                    {item.title}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 shrink-0">
                <div className="text-right">
                  <p className="text-[14px] text-[#7E7E7E]">{item.rightTop}</p>
                  <p className="text-[14px] text-[#7E7E7E] mt-1">
                    {item.rightBottom}
                  </p>
                </div>

                <ChevronIcon
                  className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {/* Body */}
            {open ? (
              <div className="px-4 py-3 border-t border-[#E2E8EF]">
                {item.renderContent ? item.renderContent(item) : item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ChevronIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="#434343"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
