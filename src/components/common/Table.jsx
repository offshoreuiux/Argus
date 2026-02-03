import React from "react";

function Table({ headerArr, children, containerClassName }) {
  return (
    <div
      className={`mt-5 overflow-x-auto border border-[#F1F1F1] rounded-lg ${containerClassName}`}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F0F0F0] text-left text-sm text-gray-600 sticky top-0">
            {headerArr.map((col, index) => (
              <th
                key={index}
                className={`p-3 font-medium ${headerArr.length - 1 ? "border-r border-[#dbdbdb]" : ""}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default Table;
