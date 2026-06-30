import { useState } from "react";
import { createBudget, updateBudget } from "../api/drupal";
import { CATEGORY_KEYS, CATEGORY_MAP } from "../pages/Dashboard";
import toast from "react-hot-toast";

export default function BudgetManager({ budgets, catSpend, onRefresh }) {
  const [editing, setEditing] = useState({});
  const [saving, setSaving] = useState(null);

  const budgetMap = {};
  budgets.forEach(b => { budgetMap[b.category] = b; });

  const save = async (cat) => {
    const val = parseFloat(editing[cat]);
    if (!val || val <= 0) return toast.error("Enter a valid limit.");
    setSaving(cat);
    try {
      const existing = budgetMap[cat];
      if (existing) {
        await updateBudget(existing.id, val);
      } else {
        await createBudget(cat, val);
      }
      toast.success(`Budget for ${cat} saved.`);
      onRefresh();
      setEditing(e => ({ ...e, [cat]: "" }));
    } catch {
      toast.error("Failed to save budget.");
    } finally {
      setSaving(null);
    }
  };

  const fmt = (n) => `₹${(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="budget-section">
      <h2 className="section-title">Monthly Budgets</h2>
      <p className="section-sub">Set spending limits per category. You'll be alerted when you go over.</p>
      <div className="budget-grid">
        {CATEGORY_KEYS.map(key => {
          const cat = key;
          const spent = catSpend[key] || 0;
          const budget = budgetMap[key];
          const limit = budget?.limit || 0;
          const pct = limit ? Math.min((spent / limit) * 100, 100) : 0;
          const over = limit && spent > limit;

          return (
            <div className={`budget-card ${over ? "over" : ""}`} key={key}>
              <div className="bcat-header">
                <span className="bcat-name">{CATEGORY_MAP[key]}</span>
                {over && <span className="over-tag">Over budget!</span>}
              </div>
              <div className="bcat-spent">{fmt(spent)} spent</div>
              {limit > 0 && (
                <>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: over ? "#ef4444" : "#6366f1",
                      }}
                    />
                  </div>
                  <div className="bcat-limit">Limit: {fmt(limit)}</div>
                </>
              )}
              <div className="bcat-edit">
                <input
                  type="number" min="0" placeholder={limit ? `${limit}` : "Set limit"}
                  value={editing[key] || ""}
                  onChange={e => setEditing(ed => ({ ...ed, [key]: e.target.value }))}
                />
                <button
                  className="btn-primary small"
                  onClick={() => save(key)}
                  disabled={saving === key}
                >
                  {saving === key ? "…" : "Save"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
