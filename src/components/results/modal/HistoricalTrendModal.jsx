import React, { useMemo } from "react";
import Modal from "../../common/Modal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export default function HistoricalTrendModal({
  isOpen,
  onClose,
  obligationId = "OBL-002",
  obligationTitle = "Implement security measures",
  periodLabel = "Last 30 days (2024-01-20 - 2023-12-21)",
  threshold = 95,
  summary = {
    daysBelowThreshold: 12,
    previousViolations: 3,
    averageValue: "91.2%",
    minMax: "78% / 96%",
  },
  // ✅ expects [{ date: 'Dec 21', value: 82 }, ...]
  series = [],
}) {
  const chartData = useMemo(() => {
    // If API sends different keys, map them here.
    // Example fallback mock if series empty:
    if (!series?.length) {
      return [
        { date: "Dec 21", value: 82 },
        { date: "Dec 22", value: 75 },
        { date: "Dec 23", value: 80 },
        { date: "Dec 24", value: 68 },
        { date: "Dec 25", value: 74 },
        { date: "Dec 26", value: 60 },
        { date: "Dec 27", value: 58 },
        { date: "Dec 28", value: 62 },
        { date: "Dec 29", value: 52 },
        { date: "Dec 30", value: 55 },
        { date: "Jan 1", value: 48 },
        { date: "Jan 3", value: 44 },
        { date: "Jan 5", value: 40 },
        { date: "Jan 7", value: 36 },
        { date: "Jan 9", value: 32 },
        { date: "Jan 11", value: 28 },
        { date: "Jan 13", value: 24 },
        { date: "Jan 15", value: 20 },
        { date: "Jan 17", value: 18 },
        { date: "Jan 20", value: 15 },
      ];
    }

    return series.map((p) => ({
      date: p.date,
      value: Number(p.value),
    }));
  }, [series]);

  const currentValue = chartData?.length
    ? `${chartData[chartData.length - 1].value}%`
    : "-";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Historical Trend"
      bodyClassName="!p-0"
      widthClass="w-[560px]"
    >
      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        {/* Obligation */}
        <div>
          <p className="text-[14px] font-medium text-[#7E7E7E]">
            Obligation ID
          </p>
          <p className="text-[16px] font-semibold text-[#434343] mt-1">
            {obligationId} - {obligationTitle}
          </p>
        </div>

        {/* Period */}
        <div className="mt-4">
          <p className="text-[14px] font-medium text-[#7E7E7E]">
            Period Covered
          </p>
          <p className="text-[14px] text-[#0F192E] mt-1">{periodLabel}</p>
        </div>

        {/* Chart */}
        <div className="mt-4 border border-[#E2E8EF] rounded-lg bg-[#F9FBFD] p-4">
          <p className="text-[14px] font-medium text-[#4B5563]">
            Metric Trend (Last 30 Days)
          </p>

          <div className="mt-3 h-[220px] border border-[#E7EEF7] rounded-lg bg-white px-2 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(val) => [`${val}%`, "Value"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />

                {/* Threshold line */}
                <ReferenceLine
                  y={threshold}
                  stroke="red"
                  strokeDasharray="6 6"
                  label={{
                    value: `Threshold (${threshold}%)`,
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: "red",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[14px] font-medium text-[#7E7E7E] mt-3">
            Chart showing trend over 30 days | Threshold line at {threshold}% |
            Current: {currentValue}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="mt-5">
          <p className="text-[14px] font-semibold text-[#434343]">
            Summary Statistics
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatTile
              label="Days Below Threshold"
              value={summary.daysBelowThreshold}
              variant="info"
            />
            <StatTile
              label="Previous Violations"
              value={summary.previousViolations}
              variant="danger"
            />
            <StatTile
              label="Average Value"
              value={summary.averageValue}
              variant="success"
            />
            <StatTile
              label="Min/Max Values"
              value={summary.minMax}
              variant="purple"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function StatTile({ label, value, variant = "info" }) {
  const styles =
    variant === "info"
      ? "bg-[#EFF6FF] border-[#CBDDF4]"
      : variant === "danger"
        ? "bg-[#FFF1F1] border-[#F9BEBE]"
        : variant === "success"
          ? "bg-[#EBFFEB] border-[#A9EBA9]"
          : "bg-[#F5F3FF] border-[#E1D9FF]";

  return (
    <div className={`border rounded-lg p-4 ${styles}`}>
      <p className="text-[14px] font-medium text-[#7E7E7E]">{label}</p>
      <p className="text-[16px] font-semibold text-[#434343] mt-1">{value}</p>
    </div>
  );
}
