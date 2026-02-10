import PrimaryButton from "../components/common/PrimaryButton";
import MappingList from "../components/mapping/MappingList";
import { useMappingContext } from "../contexts/MappingContext";
import MappingWizard from "../components/mapping/MappingWizard";

function MappingEditor() {
  const { create, setCreate, setEditingId, setMode } = useMappingContext();

  return (
    <div className="h-screen p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[24px] font-bold text-[#242424]">
            {!create ? "Mapping Editor" : "AI-Guided Control Mapping"}
          </p>
          <p className="text-[16px] text-[#7E7E7E] mt-1">
            {!create
              ? "Configure control mappings with a 4-step wizard"
              : "Map obligations to data sources with AI-recommended control patterns"}
          </p>
        </div>
        {!create && (
          <PrimaryButton
            onClick={() => {
              setCreate(true);
              setMode("create");
              setEditingId(null);
            }}
          >
            + Create Mapping
          </PrimaryButton>
        )}
      </div>

      {!create ? <MappingList /> : <MappingWizard />}
    </div>
  );
}

export default MappingEditor;
