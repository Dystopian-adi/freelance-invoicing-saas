import api from './api';

export async function register(name, email, password, passwordConfirmation) {
  await api.get('/sanctum/csrf-cookie');
  await api.post('/api/register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });
  return getUser();
}

export async function login(email, password) {
  await api.get('/sanctum/csrf-cookie');
  await api.post('/api/login', { email, password });
  return getUser();
}

export async function getUser() {
  const { data } = await api.get('/api/user');
  return data;
}

export async function logout() {
  await api.post('/api/logout');
}