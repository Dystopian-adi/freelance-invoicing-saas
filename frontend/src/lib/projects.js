import api from "./api";

export async function getProject(id) {
  const { data } = await api.get(`/api/projects/${id}`);
  return data.data;
}

export async function createProject(clientId, payload) {
  const { data } = await api.post(`/api/clients/${clientId}/projects`, payload);
  return data.data;
}

export async function updateProject(id, payload) {
  const { data } = await api.put(`/api/projects/${id}`, payload);
  return data.data;
}

export async function deleteProject(id) {
  await api.delete(`/api/projects/${id}`);
}
