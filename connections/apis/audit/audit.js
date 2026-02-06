import { apiURL } from "../../axios";

export const fetchAuditBundlesApi = ({ institution_id } = {}) => {
  const params = {};

  if (institution_id && String(institution_id).trim()) {
    params.institution_id = institution_id;
  }

  return apiURL.get("audit/bundles", { params });
};

export const createAuditBundleApi = (payload) => {
  return apiURL.post("audit/bundles", payload);
};

export const fetchSingleAuditSummaryApi = (bundle_id) => {
  if (!bundle_id) throw new Error("bundle_id is required");
  return apiURL.get(`audit/bundles/${bundle_id}/summary`);
};

export const downloadSingleAuditBundleApi = (bundle_id) => {
  if (!bundle_id) throw new Error("bundle_id is required");

  return apiURL.get(`audit/bundles/${bundle_id}/download`, {
    responseType: "blob",
  });
};
