import { apiFetch } from "../fetchData";

export const getAIModels = async () => {
  const res = await apiFetch({ endpoint: "/v1-openai/models", method: "GET" });
  return res;
};
