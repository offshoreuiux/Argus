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
export const formatTimeHHMMSS = (isoString) => {
  if (!isoString) return "-";

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "-";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};
export const formatDuration = (duration) => {
  if (!duration && duration !== 0) return "-";

  // API gives value in HOURS (even though key name says seconds)
  const totalSeconds = Math.round(Number(duration) * 3600);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
};

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

const toYMD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export const buildDateRangeParams = (rangeValue) => {
  if (!rangeValue) return { from_date: undefined, to_date: undefined };

  const today = new Date();
  const end = new Date(today); // to_date
  let start = null;

  if (rangeValue === "today") {
    start = new Date(today);
  } else if (rangeValue === "last_7_days") {
    start = new Date(today);
    start.setDate(start.getDate() - 7);
  } else if (rangeValue === "last_30_days") {
    start = new Date(today);
    start.setDate(start.getDate() - 30);
  }

  return {
    from_date: start ? toYMD(start) : undefined,
    to_date: toYMD(end),
  };
};

// ✅ CSV helpers (put above the component or in a utils file)
const toCsvValue = (val) => {
  if (val === null || val === undefined) return "";

  // If API sends arrays/objects, stringify them
  const str = typeof val === "object" ? JSON.stringify(val) : String(val);

  // Escape for CSV (double quotes, commas, new lines)
  const escaped = str.replace(/"/g, '""');
  return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
};
export const buildCsv = (rows, headers) => {
  const headerLine = headers.map(toCsvValue).join(",");
  const dataLines = rows.map((row) =>
    headers.map((h) => toCsvValue(row[h])).join(","),
  );
  return [headerLine, ...dataLines].join("\n");
};

export const downloadFile = (
  content,
  filename,
  mimeType = "text/csv;charset=utf-8;",
) => {
  // Add UTF-8 BOM so Excel opens it correctly
  const blob = new Blob(["\uFEFF", content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};

export const downloadBlobResponse = (res, fallbackName = "bundle.zip") => {
  const blob = new Blob([res.data], {
    type: res.headers?.["content-type"] || "application/zip",
  });

  // try to read filename from content-disposition
  const disposition = res.headers?.["content-disposition"] || "";
  const match =
    disposition.match(/filename\*=UTF-8''([^;]+)/i) ||
    disposition.match(/filename="?([^"]+)"?/i);

  const filename = match?.[1] ? decodeURIComponent(match[1]) : fallbackName;

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
};
