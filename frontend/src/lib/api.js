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

  getProjects: () => fetch(`${API_BASE}/project`).then(res => res.json()),

  getProjectBySlug: (slug) => fetch(`${API_BASE}/project/slug/${slug}`),

  createProject: (payload, navigate) =>
    fetch(`${API_BASE}/project`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    }).then(res => handleResponse(res, navigate)),

  updateProject: (id, payload, navigate) =>
    fetch(`${API_BASE}/project/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    }).then(res => handleResponse(res, navigate)),

  deleteProject: (id, navigate) =>
    fetch(`${API_BASE}/project/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(res => handleResponse(res, navigate)),
};