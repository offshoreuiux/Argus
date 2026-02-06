import { apiURL } from "../../axios";

export const fetchObligationListApi = ({
  regulation_id,
  status,
  confidence,
  page = 1,
  limit = 20,
} = {}) => {
  const params = {
    page: Number(page) || 1,
    limit: Number(limit) || 20,
  };

  if (regulation_id) params.regulation_id = regulation_id;
  if (status) params.status = status; // "active" / "draft"
  if (confidence) params.confidence = confidence; // "high" / "medium" / "low"

  return apiURL.get("obligations", { params });
};

export const fetchSingleObligationApi = (obligation_id) => {
  if (!obligation_id) {
    throw new Error("obligation_id is required");
  }

  return apiURL.get(`obligations/${obligation_id}`);
};

export const updateSingleObligationApi = (obligation_id, payload) => {
  if (!obligation_id) {
    throw new Error("obligation_id is required");
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("payload is required and must be an object");
  }

  return apiURL.put(`obligations/${obligation_id}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const approveSingleObligationApi = (obligation_id, payload) => {
  if (!obligation_id) {
    throw new Error("obligation_id is required");
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("payload is required");
  }

  return apiURL.post(`obligations/${obligation_id}/approve`, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export const fetchControlPatternsApi = () => {
  return apiURL.get(`control-patterns`);
};
