const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function apiFetch(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    const message = data?.error || res.statusText || "Request failed";
    throw new Error(message);
  }
  return data;
}

export const AuthAPI = {
  signup: (payload) => apiFetch("/api/auth/signup", { method: "POST", body: payload }),
  login: (payload) => apiFetch("/api/auth/login", { method: "POST", body: payload }),
  me: (token) => apiFetch("/api/auth/me", { token }),
};

export const HabitsAPI = {
  list: (token) => apiFetch("/api/habits", { token }),
  create: (payload, token) => apiFetch("/api/habits", { method: "POST", token, body: payload }),
  update: (id, payload, token) => apiFetch(`/api/habits/${id}`, { method: "PATCH", token, body: payload }),
  toggle: (id, token) => apiFetch(`/api/habits/${id}/toggle`, { method: "POST", token }),
  remove: (id, token) => apiFetch(`/api/habits/${id}`, { method: "DELETE", token }),
};

export const TasksAPI = {
  list: (token) => apiFetch("/api/tasks", { token }),
  create: (payload, token) => apiFetch("/api/tasks", { method: "POST", token, body: payload }),
  update: (id, payload, token) => apiFetch(`/api/tasks/${id}`, { method: "PATCH", token, body: payload }),
  remove: (id, token) => apiFetch(`/api/tasks/${id}`, { method: "DELETE", token }),
};

export const StatsAPI = {
  weekly: (token) => apiFetch("/api/stats/weekly", { token }),
  weeklyByHabit: (token) => apiFetch("/api/stats/weekly-by-habit", { token }),
  leaderboard: (token) => apiFetch("/api/stats/leaderboard", { token }),
};


