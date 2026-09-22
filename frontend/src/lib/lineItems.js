import api from "./api";

export async function createLineItem(invoiceId, payload) {
  const { data } = await api.post(
    `/api/invoices/${invoiceId}/line-items`,
    payload,
  );
  return data.data;
}

export async function deleteLineItem(id) {
  await api.delete(`/api/line-items/${id}`);
}
