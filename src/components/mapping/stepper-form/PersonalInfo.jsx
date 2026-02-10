import React, { useMemo, useState } from "react";
import ThresholdIcon from "../../../assets/images/svg/threshold-check.svg";
import FormulaIcon from "../../../assets/images/svg/formula-check.svg";
import TimelinessIcon from "../../../assets/images/svg/timeliness-check.svg";
import { useMappingContext } from "../../../contexts/MappingContext";

const cardsArr = [
  {
    id: 1,
    title: "Threshold Check",
    description: "Monitor metrics against defined thresholds",
    icon: ThresholdIcon,
  },
  {
    id: 2,
    title: "Formula Check",
    description: "Validate data using complex formulas",
    icon: FormulaIcon,
  },
  {
    id: 3,
    title: "Timeliness Check",
    description: "Check compliance with time-based requirements",
    icon: TimelinessIcon,
  },
];

function PersonalInfo() {
  const { wizard, updateWizard } = useMappingContext();
  const selectedCards = useMemo(
    () => (wizard?.control_pattern_id ? [wizard?.control_pattern_id] : []),
    [wizard?.control_pattern_id],
  );

  const toggle = (id) => {
    // if you want SINGLE select:
    updateWizard({ control_pattern_id: id });

    // if you want MULTI select, store an array in context instead.
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="text-[20px] font-bold text-[#242424]">
          Step 1: Select Control Pattern
        </p>
        <p className="text-[14px] text-[#7E7E7E] mt-1">
          Choose how you want to validate this obligation
        </p>
      </div>

      <div className="p-4 bg-[#EDFFFD] border border-[#B0E4DF] rounded-xl">
        <div>
          <p className="text-[12px] text-[#7E7E7E]">Obligation being mapped:</p>
          <p className="text-[14px] text-[#242424] mt-1">
            OBL-001: Maintain detailed records of all data processing activities
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {cardsArr.map((card) => {
          const isSelected = selectedCards.includes(card.id);

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => toggle(card.id)}
              className={`
                flex flex-col items-start gap-2 py-4 px-3 rounded-xl text-left transition-all
                focus:outline-none
                ${
                  isSelected
                    ? "bg-[#FFFFFF] border-2 border-[#00D1BC] shadow-[0_0_0_2px_rgba(0,209,188,0.15)]"
                    : "bg-white border border-[#E2E8EF] hover:border-[#00D1BC]"
                }
              `}
            >
              <img src={card.icon} alt={card.title} />

              <div className="text-start ml-2">
                <p className="text-[16px] font-medium text-[#242424]">
                  {card.title}
                </p>
                <p className="text-[14px] text-[#7E7E7E] mt-1">
                  {card.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PersonalInfo;
