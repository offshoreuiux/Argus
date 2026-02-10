import { apiURL } from "../axios";

export const fetchControlPatternsApi = () => {
  return apiURL.get(`control-patterns`);
};

export const fetchDataSetsApi = () => {
  return apiURL.get(`datasets`);
};

export const fetchSemanticRegistryApi = () => {
  return apiURL.get(`semantic-registry`);
};
