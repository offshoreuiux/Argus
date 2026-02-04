import React from "react";
import ExecuteCompliance from "../components/execution/ExecuteCompliance";
import JobHistory from "../components/execution/JobHistory";

function ExecutionHistory() {
  return (
    <div className="h-screen p-[24px] flex flex-col gap-6">
      <div>
        <p className="text-[24px] font-bold text-[#242424]">
          Execution & Job History
        </p>
        <p className="text-[16px] text-[#7E7E7E] mt-1">
          Run and monitor compliance checks across institutions
        </p>
      </div>

      <ExecuteCompliance />
      <JobHistory />
    </div>
  );
}

export default ExecutionHistory;
