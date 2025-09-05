const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const withAuthHeaders = (headers = {}) => {
  const token = localStorage.getItem('token');
  return token
    ? { ...headers, Authorization: `Bearer ${token}` }
    : headers;
};

const handleResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => ({})) : null;
  if (!res.ok) {
    const message = (data && (data.message || (data.errors && data.errors[0]?.msg))) || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

const request = (path, options = {}) => {
  const { headers, body, ...rest } = options;
  return fetch(`${BASE_URL}${path}`, {
    headers: withAuthHeaders({ 'Content-Type': 'application/json', ...(headers || {}) }),
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  }).then(handleResponse);
};

export const get = (path, options = {}) => request(path, { method: 'GET', ...options });
export const post = (path, body, options = {}) => request(path, { method: 'POST', body, ...options });
export const put = (path, body, options = {}) => request(path, { method: 'PUT', body, ...options });
export const del = (path, options = {}) => request(path, { method: 'DELETE', ...options });

export const uploadFile = (path, formData) => {
  return fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: withAuthHeaders(), // Do not set Content-Type; the browser will set multipart boundary
    body: formData,
  }).then(handleResponse);
};

export const apiBaseUrl = BASE_URL;