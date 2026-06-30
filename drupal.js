import axios from "axios";

const BASE = import.meta.env.VITE_DRUPAL_BASE || "http://localhost/drupal-test/web";

const getAuthHeader = () => {
  const creds = localStorage.getItem("basic_creds");
  return creds ? { Authorization: `Basic ${creds}` } : {};
};

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  Object.assign(config.headers, getAuthHeader());
  return config;
});

// ── Auth ──────────────────────────────────────────────────
export const login = async (name, pass) => {
  const creds = btoa(`${name}:${pass}`);

  const verifyRes = await axios.get(
    `${BASE}/jsonapi/user/user?filter[name]=${encodeURIComponent(name)}`,
    { headers: { Authorization: `Basic ${creds}` } }
  );

  const uid = verifyRes.data?.data?.[0]?.attributes?.drupal_internal__uid || "1";

  localStorage.setItem("basic_creds", creds);
  localStorage.setItem("username", name);
  localStorage.setItem("uid", uid);

  return { name, uid };
};

export const logout = () => {
  localStorage.clear();
  return Promise.resolve();
};

// ── Expenses (JSON:API) ───────────────────────────────────
export const getExpenses = () => {
  const uid = localStorage.getItem("uid");
  return api.get(`/jsonapi/node/expense?filter[uid.drupal_internal__uid]=${uid}&sort=-field_date&page[limit]=200`);
};

export const createExpense = (data) =>
  api.post("/jsonapi/node/expense", {
    data: {
      type: "node--expense",
      attributes: {
        title: data.description || "Expense",
        field_amount: parseFloat(data.amount),
        field_category: data.category,
        field_description: data.description,
        field_date: data.date + "T00:00:00+00:00",
        field_is_recurring: data.isRecurring || false,
      },
    },
  }, { headers: { "Content-Type": "application/vnd.api+json" } });

export const updateExpense = (id, data) =>
  api.patch(`/jsonapi/node/expense/${id}`, {
    data: {
      type: "node--expense",
      id,
      attributes: {
        title: data.description || "Expense",
        field_amount: parseFloat(data.amount),
        field_category: data.category,
        field_description: data.description,
        field_date: data.date + "T00:00:00+00:00",
        field_is_recurring: data.isRecurring || false,
      },
    },
  }, { headers: { "Content-Type": "application/vnd.api+json" } });

export const deleteExpense = (id) =>
  api.delete(`/jsonapi/node/expense/${id}`, {
    headers: { "Content-Type": "application/vnd.api+json" },
  });

// ── Budgets ───────────────────────────────────────────────
export const getBudgets = () => {
  const uid = localStorage.getItem("uid");
  return api.get(`/jsonapi/node/budget?filter[uid.drupal_internal__uid]=${uid}&page[limit]=50`);
};

export const createBudget = (category, limit) =>
  api.post("/jsonapi/node/budget", {
    data: {
      type: "node--budget",
      attributes: {
        title: `Budget: ${category}`,
        field_budget_category: category,
        field_monthly_limit: parseFloat(limit),
      },
    },
  }, { headers: { "Content-Type": "application/vnd.api+json" } });

export const updateBudget = (id, limit) =>
  api.patch(`/jsonapi/node/budget/${id}`, {
    data: {
      type: "node--budget",
      id,
      attributes: { field_monthly_limit: parseFloat(limit) },
    },
  }, { headers: { "Content-Type": "application/vnd.api+json" } });