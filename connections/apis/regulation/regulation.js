import { apiURL } from "../../axios";

export const uploadRegulationApi = (payload, onProgress) => {
  const form = new FormData();

  form.append("file", payload.file);
  form.append("metadata", payload.metadata);

  return apiURL.post("regulations/upload", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (evt) => {
      if (!evt.total) return;
      const percent = Math.round((evt.loaded * 100) / evt.total);
      onProgress?.(percent);
    },
  });
};

export const fetchRegulationListApi = ({
  status,
  page = 1,
  limit = 20,
} = {}) => {
  return apiURL.get("regulations", {
    params: {
      ...(status && { status }),
      page,
      limit,
    },
  });
};

export const fetchSingleRegulationsApi = (doc_id) => {
  if (!doc_id) {
    throw new Error("doc_id is required");
  }

  return apiURL.get(`regulations/${doc_id}`);
};
