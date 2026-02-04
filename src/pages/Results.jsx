import React from "react";
import Card from "../components/common/Card";
import ExecutionSummary from "../components/results/ExecutionSummary";
import ControlResults from "../components/results/ControlResults";

function Results() {
  return (
    <div className="h-screen p-[24px] flex flex-col gap-6">
      <div>
        <p className="text-[24px] font-bold text-[#242424]">
          Results & Exceptions
        </p>
        <p className="text-[16px] text-[#7E7E7E] mt-1">
          View control results and manage compliance exceptions
        </p>
      </div>

      <ExecutionSummary />

      <ControlResults />
    </div>
  );
}

export default Results;
