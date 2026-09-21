import api from "./api";

export async function getClients() {
  const { data } = await api.get("/api/clients");
  return data.data; // Laravel's ResourceCollection wraps in { data: [...] }
}

export async function getClient(id) {
  const { data } = await api.get(`/api/clients/${id}`);
  return data.data;
}

export async function createClient(payload) {
  const { data } = await api.post("/api/clients", payload);
  return data.data;
}

export async function updateClient(id, payload) {
  const { data } = await api.put(`/api/clients/${id}`, payload);
  return data.data;
}

export async function deleteClient(id) {
  await api.delete(`/api/clients/${id}`);
}
