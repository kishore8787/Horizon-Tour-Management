import { useState, useEffect, useCallback } from "react";
import { getExpenses, getBudgets } from "../api/drupal";
import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import AlertBanner from "../components/AlertBanner";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import CategoryChart from "../components/CategoryChart";
import MonthlyChart from "../components/MonthlyChart";
import BudgetManager from "../components/BudgetManager";
import "../styles/dashboard.css";

// key = Drupal stored value, label = display name
export const CATEGORY_MAP = {
  food_dining:      "Food & Dining",
  transport:        "Transport",
  bills_utilities:  "Bills & Utilities",
  health:           "Health",
  shopping:         "Shopping",
  entertainment:    "Entertainment",
  education:        "Education",
  other:            "Other",
};
export const CATEGORY_KEYS = Object.keys(CATEGORY_MAP);
export const CATEGORIES = CATEGORY_KEYS; // alias used by other components

function parseExpenses(raw) {
  return (raw?.data || []).map(n => ({
    id: n.id,
    amount: parseFloat(n.attributes.field_amount) || 0,
    category: n.attributes.field_category || "Other",
    description: n.attributes.field_description || n.attributes.title,
    date: n.attributes.field_date || n.attributes.created?.slice(0, 10),
    isRecurring: n.attributes.field_is_recurring || false,
  }));
}

function parseBudgets(raw) {
  return (raw?.data || []).map(n => ({
    id: n.id,
    category: n.attributes.field_budget_category,
    limit: parseFloat(n.attributes.field_monthly_limit) || 0,
  }));
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [expRes, budRes] = await Promise.all([getExpenses(), getBudgets()]);
      setExpenses(parseExpenses(expRes.data));
      setBudgets(parseBudgets(budRes.data));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const now = new Date();
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalAll = expenses.reduce((s, e) => s + e.amount, 0);
  const totalMonth = thisMonth.reduce((s, e) => s + e.amount, 0);
  const avgDay = thisMonth.length
    ? totalMonth / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    : 0;
  const avgMonth = (() => {
    const months = [...new Set(expenses.map(e => e.date?.slice(0, 7)))].length || 1;
    return totalAll / months;
  })();

  // Category spend this month (keyed by Drupal key e.g. "food_dining")
  const catSpend = {};
  CATEGORY_KEYS.forEach(k => catSpend[k] = 0);
  thisMonth.forEach(e => { catSpend[e.category] = (catSpend[e.category] || 0) + e.amount; });

  // Over-budget alerts
  const alerts = budgets.filter(b => (catSpend[b.category] || 0) > b.limit);

  // Monthly data for bar chart
  const monthlyData = (() => {
    const map = {};
    expenses.forEach(e => {
      const key = e.date?.slice(0, 7);
      if (key) map[key] = (map[key] || 0) + e.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, total]) => ({ month, total: +total.toFixed(2) }));
  })();

  const catData = CATEGORY_KEYS
    .map(k => ({ name: CATEGORY_MAP[k], value: +(catSpend[k] || 0).toFixed(2) }))
    .filter(c => c.value > 0);

  const stats = { totalAll, totalMonth, avgDay, avgMonth };

  const exportCSV = () => {
    const rows = [
      ["Date", "Category", "Description", "Amount", "Recurring"],
      ...expenses.map(e => [e.date, e.category, e.description, e.amount, e.isRecurring]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "expenses.csv"; a.click();
  };

  return (
    <div className="dash-root">
      <Navbar tab={tab} setTab={setTab} onExport={exportCSV} />

      <main className="dash-main">
        {alerts.length > 0 && <AlertBanner alerts={alerts} catSpend={catSpend} />}

        {tab === "dashboard" && (
          <>
            <StatsCards stats={stats} loading={loading} />
            <div className="charts-row">
              <MonthlyChart data={monthlyData} />
              <CategoryChart data={catData} />
            </div>
            <ExpenseList
              expenses={expenses.slice(0, 8)}
              onRefresh={fetchAll}
              budgets={budgets}
              title="Recent Expenses"
              showAll={() => setTab("expenses")}
            />
          </>
        )}

        {tab === "expenses" && (
          <>
            <ExpenseForm onRefresh={fetchAll} />
            <ExpenseList
              expenses={expenses}
              onRefresh={fetchAll}
              budgets={budgets}
              title="All Expenses"
            />
          </>
        )}

        {tab === "budgets" && (
          <BudgetManager
            budgets={budgets}
            catSpend={catSpend}
            onRefresh={fetchAll}
          />
        )}
      </main>
    </div>
  );
}
