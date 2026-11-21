
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getApiAssetUrl = path => new URL(path, API_BASE_URL).toString();

export const apiRequest = async (
  endpoint,
  { method = 'GET', body, token } = {}
) => {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
  method,
  headers: {
    ...headers,
    'Cache-Control': 'no-cache'
  },
  cache: 'no-store',
  ...(body !== undefined && {
    body: isFormData ? body : JSON.stringify(body)
  })
});

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};
