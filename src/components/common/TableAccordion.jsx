import React, { useState } from "react";

export default function TableAccordion({
  columns = [],
  rows = [],
  defaultOpenId = null,
  getRowId = (row) => row.id,
  renderRow,
  renderExpanded,
  rowClassName = "",
  headerClassName = "",
}) {
  const [openId, setOpenId] = useState(defaultOpenId);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  const gridTemplateColumns = columns
    .map((c) => c.width || "minmax(0, 1fr)")
    .join(" ");

  return (
    <div className="w-full border border-[#E7EEF7] rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div
        className={`grid ${headerClassName}`}
        style={{ gridTemplateColumns }}
      >
        {columns.map((c) => (
          <div
            key={c.key}
            className={`p-3 text-[14px] font-medium text-[#606060]
              bg-[#F0F0F0] border-b border-[#E7EEF7] border-r
              ${c.headerCellClassName || ""}`}
          >
            {c.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#E7EEF7]">
        {rows.map((row) => {
          const id = getRowId(row);
          const open = openId === id;

          return (
            <div key={id}>
              {/* Row */}
              <button
                type="button"
                onClick={() => toggle(id)}
                className="w-full"
              >
                <div
                  className={`grid items-center cursor-pointer ${rowClassName}
                    ${open ? "bg-[#E3EDF9]" : "bg-white hover:bg-[#F8FAFC]"}`}
                  style={{ gridTemplateColumns }}
                >
                  {renderRow(row, { open })}
                </div>
              </button>

              {/* Expanded */}
              {open ? (
                <div className="bg-white px-4 py-4">
                  {renderExpanded?.(row)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
