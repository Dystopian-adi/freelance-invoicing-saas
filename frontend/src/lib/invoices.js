import api from "./api";

export async function getInvoice(id) {
  const { data } = await api.get(`/api/invoices/${id}`);
  return data.data;
}

export async function updateInvoice(id, payload) {
  const { data } = await api.put(`/api/invoices/${id}`, payload);
  return data.data;
}
