const request = async (url, options = {}) => {
  const { body, ...rest } = options;

  const res = await fetch(url, {
    credentials: 'include',
    ...rest,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...rest.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return data;
};

export const http = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body }),
  put: (url, body) => request(url, { method: 'PUT', body }),
  delete: (url) => request(url, { method: 'DELETE' }),
};
