import React, { useState } from "react";
import PersonalInfo from "./stepper-form/PersonalInfo";
import DataConnection from "./stepper-form/DataConnection";
import Validation from "./stepper-form/Validation";
import Summary from "./stepper-form/Summary";

import Card from "../common/Card";
import OutlinedButton from "../common/OutlinedButton";
import PrimaryButton from "../common/PrimaryButton";

import { useMappingContext } from "../../contexts/MappingContext";
import DotIcon from "../../assets/images/svg/dot.svg";

import {
  createMappingApi,
  updateMappingApi,
} from "../../../connections/apis/mapping/mapping";

const mappingArr = [
  { title: "Personal info", description: "AI recommends control pattern" },
  { title: "Data Connection", description: "Select data source" },
  { title: "Validation", description: "Set parameters and test" },
  { title: "Summary", description: "Review and activate" },
];

const CheckIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function MappingWizard() {
  const [steps, setSteps] = useState(1);
  const {
    setCreate,
    wizard,
    submitting,
    setSubmitting,
    submitError,
    setSubmitError,
    mode,
    editingId,
  } = useMappingContext();

  const handlePreviousStep = () => {
    setSubmitError("");
    if (steps === 1) setCreate(false);
    else setSteps((prev) => prev - 1);
  };

  const submitMapping = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const concept_mappings = {
        threshold_check: {
          dataset: wizard?.data_source?.dataset,
          column: wizard?.validation?.metricField,
          aggregation: wizard?.data_source?.aggregation || "SUM",
          filter_column: wizard?.data_source?.filter_column || "",
          filter_value: wizard?.data_source?.filter_value || "",
        },
      };

      const payload = {
        concept_mappings,
        execution_frequency: wizard?.execution_frequency,
        priority: wizard?.priority,
      };

      if (mode !== "edit") {
        await createMappingApi({
          obligation_id: wizard?.obligation_id,
          ...payload,
        });
      } else {
        if (!editingId) {
          throw new Error(
            "editingId is missing. Please open mapping via Edit.",
          );
        }
        await updateMappingApi(editingId, payload);
      }

      setCreate(false);
    } catch (e) {
      setSubmitError(
        e?.response?.data?.message || e?.message || "Failed to submit mapping",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    setSubmitError("");

    // ✅ simple per-step validation (optional but recommended)
    if (steps === 1 && !wizard?.control_pattern_id) {
      setSubmitError("Please select a control pattern.");
      return;
    }

    if (steps === 2 && !wizard?.data_source?.dataset) {
      setSubmitError("Please select a table.");
      return;
    }

    if (steps === 3 && !wizard?.validation?.thresholdValue) {
      setSubmitError("Please enter a threshold value.");
      return;
    }

    // ✅ final step => call API
    if (steps === 4) {
      await submitMapping();
      return;
    }

    setSteps((prev) => Math.min(4, prev + 1));
  };

  const renderStepCircle = (stepNumber) => {
    const isCompleted = stepNumber < steps;
    const isCurrent = stepNumber === steps;

    if (isCompleted) {
      return (
        <div className="w-[40px] h-[40px] rounded-full bg-[#00D1BC] flex items-center justify-center">
          <CheckIcon className="text-white" />
        </div>
      );
    }

    if (isCurrent) {
      return (
        <div className="w-[40px] h-[40px] rounded-full border-2 border-[#00D1BC] flex items-center justify-center">
          <span className="block w-[14px] h-[14px] rounded-full bg-[#00D1BC]" />
        </div>
      );
    }

    return (
      <div className="w-[40px] h-[40px] rounded-full border-2 border-[#CBD5E1] flex items-center justify-center">
        <div className="w-[16px] h-[16px] rounded-full bg-transparent" />
      </div>
    );
  };

  const renderConnector = (leftStepNumber) => {
    const isGreen = leftStepNumber < steps;

    return (
      <div
        className={`h-[4px] w-[220px] rounded-full ${
          isGreen ? "bg-[#00D1BC]" : "bg-[#E2E8EF]"
        }`}
      />
    );
  };

  const renderStatusIcon = (index) => {
    const stepNumber = index + 1;
    const isCompleted = stepNumber < steps;

    if (isCompleted) {
      return (
        <span className="w-[25px] h-[25px] rounded-full bg-[#E9FFFB] text-[#00D1BC] flex items-center justify-center">
          <CheckIcon className="w-[20px] h-[20px]" />
        </span>
      );
    }

    return <img src={DotIcon} alt="dot" />;
  };

  const getCardClasses = (index) => {
    const stepNumber = index + 1;
    const isCompleted = stepNumber < steps;

    return isCompleted
      ? "bg-[#EEFFF3] border border-[#92D0A8]"
      : "bg-[#EFF6FF] border border-[#CBDDF4]";
  };

  return (
    <div>
      {/* TOP STEPPER */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-6">
          {[1, 2, 3, 4].map((stepNumber, index) => (
            <React.Fragment key={stepNumber}>
              {renderStepCircle(stepNumber)}
              {index < 3 && renderConnector(stepNumber)}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP CARDS */}
      <div className="grid grid-cols-4 gap-8 my-8">
        {mappingArr.map((item, index) => (
          <div
            key={item.title}
            className={`p-4 rounded-xl ${getCardClasses(index)}`}
            style={{
              boxShadow: index + 1 < steps ? "none" : "0 0 4px 0 #33568340",
            }}
          >
            <div className="flex items-start gap-2">
              {renderStatusIcon(index)}
              <div>
                <p className="text-[14px] text-[#434343] font-semibold">
                  {item.title}
                </p>
                <p className="text-[14px] text-[#7E7E7E]">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BODY */}
      <Card className={"!p-0"}>
        {steps === 1 && <PersonalInfo />}
        {steps === 2 && <DataConnection />}
        {steps === 3 && <Validation />}
        {steps === 4 && <Summary />}

        {/* show error above footer buttons */}
        {submitError ? (
          <div className="px-6 pt-4">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        ) : null}

        <div className="p-6 bg-white flex items-center justify-between gap-4 rounded-b-2xl border-t border-[#E2E8EF]">
          <OutlinedButton
            className="min-w-[150px]"
            onClick={handlePreviousStep}
            disabled={submitting}
          >
            {steps === 1 ? "Cancel" : "Back"}
          </OutlinedButton>

          <PrimaryButton
            className="min-w-[150px]"
            onClick={handleNextStep}
            disabled={submitting}
          >
            {steps === 4
              ? submitting
                ? "Activating..."
                : "Activate Mapping"
              : "Next"}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}

export default MappingWizard;
