import api from "./api.js";

export async function verifyDocuments(formData) {
  const response = await api.post("/verify", formData);
  return response.data;
}

export async function getVerification(id) {
  const response = await api.get(`/reports/${encodeURIComponent(id)}`);
  return response.data;
}
