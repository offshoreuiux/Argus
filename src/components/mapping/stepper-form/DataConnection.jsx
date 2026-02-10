import { useEffect } from "react";
import InputField from "../../common/InputField";
import { useMappingContext } from "../../../contexts/MappingContext";
import { fetchDataSetsApi } from "../../../../connections/apis/api";

function DataConnection() {
  const { wizard, updateWizard, datasetList, setDatasetList } =
    useMappingContext();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "table") {
      updateWizard({
        data_source: {
          ...wizard.data_source,
          dataset: value,
        },
      });
    }

    if (name === "filterCondition") {
      updateWizard({
        data_source: {
          ...wizard.data_source,
          filter_value: value,
        },
      });
    }
  };

  const fetchDataSets = async () => {
    try {
      const res = await fetchDataSetsApi();
      setDatasetList(res.data?.datasets);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchDataSets();
  }, []);

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="text-[20px] font-bold text-[#242424]">
          Step 2: Configure Data Source
        </p>
        <p className="text-[14px] text-[#7E7E7E] mt-1">
          Select a control pattern for this obligation
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#242424]">
            Select Table
          </label>
          <select
            name="table"
            value={wizard.data_source.dataset}
            onChange={handleChange}
            className="
                  w-full h-[46px] px-3 rounded-lg text-sm
                  border border-[#E2E8EF] bg-[#F9FBFD]
                  outline-none transition
                  focus:border-teal-500
                  disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select pattern</option>
            {datasetList.map((item) => (
              <option key={item.name} value={item.table}>
                {item.name?.split("_")?.join(" ")}
              </option>
            ))}
          </select>
        </div>

        <InputField
          labelTitle="Filter Conditions (Optional)"
          name="filterCondition"
          value={wizard.data_source.filter_value}
          handleChange={handleChange}
          placeholder="e.g., status='active' AND severity > 5"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-[#111827] mb-2">
          Parameters (JSON)
        </p>
        <textarea
          name="parameters"
          value={wizard.parameters}
          readOnly
          className="w-full h-[110px] rounded-lg border border-[#E5E7EB] p-3
             text-sm text-[#00D1BC]
             bg-gradient-to-r from-[#1F2A44] to-[#2B2F55]
             outline-none resize-none"
        />
      </div>
    </div>
  );
}

export default DataConnection;
