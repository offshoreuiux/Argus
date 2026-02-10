import { apiURL } from "../../axios";

export const fetchExceptionsListApi = ({
  run_id,
  obligation_id,
  status,
  limit = 100,
} = {}) => {
  const params = {};

  if (run_id && String(run_id).trim()) params.run_id = run_id;
  if (obligation_id && String(obligation_id).trim())
    params.obligation_id = obligation_id;

  // optional: ignore "all"
  if (status && String(status).trim() && String(status).toLowerCase() !== "all")
    params.status = status;

  const safeLimit = Math.min(500, Math.max(1, Number(limit) || 100));
  params.limit = safeLimit;

  return apiURL.get("exceptions", { params });
};
