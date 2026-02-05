export const formatDateDMY = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (isNaN(date)) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
export function formatDateTime(value) {
  if (!value) return "";

  const date = new Date(value);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export const normalizeConfidence = (val) => {
  if (val === null || val === undefined) return 0;

  // if value is like "95%" -> 95
  if (typeof val === "string" && val.includes("%")) {
    const n = Number(val.replace("%", "").trim());
    return Number.isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
  }

  // if value is numeric or numeric string
  const n = Number(val);
  if (!Number.isNaN(n)) {
    // handle 0.0-1.0 values
    if (n > 0 && n <= 1) return Math.round(n * 100);
    return Math.max(0, Math.min(100, n));
  }

  // if value is "high"/"medium"/"low"
  const s = String(val).toLowerCase().trim();
  if (s === "high") return 95;
  if (s === "medium") return 80;
  if (s === "low") return 60;

  return 0;
};

export const confidenceText = (val) => `${normalizeConfidence(val)}%`;

export const confidenceLabel = (val) => {
  if (val === null || val === undefined) return "";

  const n = Number(val);
  if (!Number.isNaN(n)) return `${n}%`;

  const v = String(val).toLowerCase().trim();
  if (v === "high") return "High";
  if (v === "medium") return "Medium";
  if (v === "low") return "Low";

  return String(val);
};

// backend => modal form
export const obligationToForm = (doc) => {
  const cur = doc?.current || {};

  return {
    originalClause: cur?.clause_text || "",
    statement: cur?.statement || "",

    // You don't really have these in backend (yet), keep defaults
    entityScope: cur?.scope?.entity_type || "organization_wide",

    // backend trigger is { type, event }
    triggerType: cur?.trigger?.type || "org_wide",
    triggerDetails: cur?.trigger?.event || "",

    // backend has structured objects, store as formatted JSON string
    parameters: JSON.stringify(
      {
        calculation: cur?.calculation,
        constraint: cur?.constraint,
        evidence_expectation: cur?.evidence_expectation,
        scope: cur?.scope,
      },
      null,
      2,
    ),

    dataRequirements: Array.isArray(cur?.evidence_expectation?.inputs)
      ? cur.evidence_expectation.inputs.join(", ")
      : "",

    controlPattern: cur?.obligation_type || "automated_workflow",

    reviewNotes: cur?.review_notes || "", // if backend later sends it
  };
};

// modal form => PUT payload (Swagger)
export const formToUpdatePayload = (form) => {
  return {
    statement: form.statement,
    trigger: form.triggerType, // string
    trigger_details: form.triggerDetails, // string
    review_notes: form.reviewNotes, // string
    reviewed_by: "user", // or dynamic from auth
  };
};
