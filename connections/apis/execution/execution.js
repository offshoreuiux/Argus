import { apiURL } from "../../axios";

export const fetchExecutionListApi = ({
  institution_id,
  status,
  from_date,
  to_date,
  page = 1,
  limit = 20,
} = {}) => {
  const params = {
    page,
    limit,
  };

  if (institution_id && String(institution_id).trim()) {
    params.institution_id = institution_id;
  }
  if (status && String(status).trim()) {
    params.status = status;
  }
  if (from_date && String(from_date).trim()) {
    params.from_date = from_date;
  }
  if (to_date && String(to_date).trim()) {
    params.to_date = to_date;
  }

  return apiURL.get("executions", { params });
};

export const runExecutionApi = ({
  institution_id,
  execution_date,
  obligation_ids,
  mode = "batch",
} = {}) => {
  // basic validation (optional but helpful)
  if (!institution_id || !String(institution_id).trim()) {
    throw new Error("institution_id is required");
  }
  if (!execution_date || !String(execution_date).trim()) {
    throw new Error("execution_date is required");
  }
  if (!Array.isArray(obligation_ids) || obligation_ids.length === 0) {
    throw new Error("obligation_ids must be a non-empty array");
  }
  if (!mode || !String(mode).trim()) {
    throw new Error("mode is required");
  }

  return apiURL.post("executions/run", {
    institution_id,
    execution_date,
    obligation_ids,
    mode,
  });
};

export const fetchSingleExecutionApi = (run_id) => {
  if (!run_id) throw new Error("run_id is required");

  return apiURL.get(`executions/${run_id}`);
};

export const fetchSingleExecutionResultsApi = (run_id) => {
  if (!run_id) throw new Error("run_id is required");
  return apiURL.get(`executions/${run_id}/results`);
};

export const fetchSingleExecutionProgressApi = (run_id) => {
  if (!run_id) throw new Error("run_id is required");
  return apiURL.get(`executions/${run_id}/progress`);
};

export const executionRunApi = (payload) => {
  return apiURL.post("executions/run", payload);
};
