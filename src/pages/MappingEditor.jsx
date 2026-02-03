import React from "react";
import PrimaryButton from "../components/common/PrimaryButton";
import MappingList from "../components/mapping/MappingList";

function MappingEditor() {
  return (
    <div className="h-screen p-[24px] bg-[#F0F2F6] flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[24px] font-bold text-[#242424]">Mapping Editor</p>
          <p className="text-[16px] text-[#7E7E7E] mt-1">
            Configure control mappings with a 4-step wizard
          </p>
        </div>
        <PrimaryButton>+ Create Mapping</PrimaryButton>
      </div>

      <MappingList />
    </div>
  );
}

export default MappingEditor;
