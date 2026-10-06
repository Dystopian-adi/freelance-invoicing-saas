import axios from "axios";

const BASE_URL = "http://localhost:8080";

export async function getPublicInvoice(invoiceId, signature) {
  const { data } = await axios.get(
    `${BASE_URL}/api/invoices/${invoiceId}/pay`,
    {
      params: { signature },
    },
  );
  return data;
}

export async function createPaymentOrder(invoiceId) {
  const { data } = await axios.post(
    `${BASE_URL}/api/invoices/${invoiceId}/pay/order`,
  );
  return data;
}

export async function verifyPayment(invoiceId, payload) {
  const { data } = await axios.post(
    `${BASE_URL}/api/invoices/${invoiceId}/pay/verify`,
    payload,
  );
  return data;
}
