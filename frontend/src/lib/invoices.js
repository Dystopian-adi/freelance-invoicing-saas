import api from "./api";

export async function getInvoice(id) {
  const { data } = await api.get(`/api/invoices/${id}`);
  return data.data;
}

export async function createInvoice(projectId, payload) {
  const { data } = await api.post(
    `/api/projects/${projectId}/invoices`,
    payload,
  );
  return data.data;
}

export async function updateInvoice(id, payload) {
  const { data } = await api.put(`/api/invoices/${id}`, payload);
  return data.data;
}

export async function deleteInvoice(id) {
  await api.delete(`/api/invoices/${id}`);
}

export async function getPaymentLink(id) {
  const { data } = await api.get(`/api/invoices/${id}/payment-link`);
  return data.url;
}
