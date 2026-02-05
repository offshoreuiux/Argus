import { apiURL } from "../../axios";

export const fetchMappingListApi = ({ obligation_id, status } = {}) => {
  const params = {};
  if (obligation_id && String(obligation_id).trim())
    params.obligation_id = obligation_id;
  if (status && status !== "all" && String(status).trim())
    params.status = status;

  return apiURL.get("mappings", { params });
};

export const createMappingApi = (payload) => {
  if (!payload || typeof payload !== "object") {
    throw new Error("payload is required and must be an object");
  }

  if (!payload.obligation_id) {
    throw new Error("obligation_id is required");
  }

  if (!payload.concept_mappings) {
    throw new Error("concept_mappings is required");
  }

  return apiURL.post("mappings", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateMappingApi = (mapping_id, payload) => {
  if (!mapping_id) {
    throw new Error("mapping_id is required");
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("payload is required and must be an object");
  }

  if (!payload.concept_mappings) {
    throw new Error("concept_mappings is required");
  }

  if (!payload.execution_frequency) {
    throw new Error("execution_frequency is required");
  }

  if (!payload.priority) {
    throw new Error("priority is required");
  }

  return apiURL.put(`mappings/${mapping_id}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const fetchSingleMappingApi = (mapping_id) => {
  if (!mapping_id) {
    throw new Error("mapping_id is required");
  }

  return apiURL.get(`mappings/${mapping_id}`);
};
