const API_BASE = import.meta.env.VITE_API_URL;

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };
}

function handleResponse(res, navigate) {
  if (res.status === 401) {
    localStorage.removeItem('token');
    navigate('/login');
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res;
}

export const api = {
  login: (username, password) =>
    fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }),

  GetProjects: () => fetch(`${API_BASE}/project`).then(res => res.json()),

  GetProjectBySlug: (slug) => fetch(`${API_BASE}/project/slug/${slug}`),

  CreateProject: (payload, navigate) =>
    fetch(`${API_BASE}/project`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    }).then(res => handleResponse(res, navigate)),

  UpdateProject: (id, payload, navigate) =>
    fetch(`${API_BASE}/project/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    }).then(res => handleResponse(res, navigate)),

  DeleteProject: (id, navigate) =>
    fetch(`${API_BASE}/project/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(res => handleResponse(res, navigate)),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    }).then(res => {
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    }).then(data => data.url);
  },
};