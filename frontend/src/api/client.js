const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? options.headers || {}
    : {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options
  });

  if (!response.ok) {
    const message = await safeParseError(response);
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function safeParseError(response) {
  try {
    const data = await response.json();
    if (typeof data === 'string') return data;
    if (data?.error) return data.error;
    if (Array.isArray(data?.errors)) return data.errors.join(', ');
  } catch {
    // ignore parsing issues
  }
  return null;
}

export const api = {
  getGrows: () => request('/v1/grows'),
  getGrow: (id) => request(`/v1/grows/${id}`),
  createGrow: (payload) =>
    request('/v1/grows', { method: 'POST', body: JSON.stringify(payload) }),

  getPlants: (growId) => request(`/v1/grows/${growId}/plants`),
  getPlant: (id) => request(`/v1/plants/${id}`),
  createPlant: (growId, payload) => {
    const formData = payload instanceof FormData ? payload : (() => {
      const fd = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') return;
        fd.append(`plant[${key}]`, value);
      });
      return fd;
    })();
    return request(`/v1/grows/${growId}/plants`, {
      method: 'POST',
      body: formData,
      headers: {}
    });
  },

  getWaterFeedEvents: (growId) =>
    request(`/v1/grows/${growId}/water_feed_events`),
  getWaterFeedEvent: (id) => request(`/v1/water_feed_events/${id}`),
  createWaterFeedEvent: (growId, payload) =>
    request(`/v1/grows/${growId}/water_feed_events`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getDailyEntries: (growId) =>
    request(`/v1/grows/${growId}/daily_entries`),
  createDailyEntry: (growId, payload) =>
    request(`/v1/grows/${growId}/daily_entries`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  createPlantDailyDatum: (plantId, payload) =>
    request(`/v1/plants/${plantId}/daily_data`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export default api;
