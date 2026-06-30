import { useState } from "react";
import { deleteExpense } from "../api/drupal";
import ExpenseForm from "./ExpenseForm";
import { CATEGORY_MAP } from "../pages/Dashboard";
import toast from "react-hot-toast";

const CAT_EMOJI = {
  food_dining: "🍽️", transport: "🚗", bills_utilities: "💡",
  health: "💊", shopping: "🛍️", entertainment: "🎬",
  education: "📚", other: "🏷️",
};

export default function ExpenseList({ expenses, onRefresh, title, showAll }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    setDeleting(id);
    try {
      await deleteExpense(id);
      toast.success("Expense deleted.");
      onRefresh();
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setDeleting(null);
    }
  };

  const fmt = (n) => `₹${parseFloat(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <div className="expense-list-section">
      <div className="list-header">
        <h2>{title}</h2>
        {showAll && (
          <button className="btn-ghost small" onClick={showAll}>View all →</button>
        )}
      </div>

      {editing && (
        <ExpenseForm
          editing={editing}
          onRefresh={onRefresh}
          onCancel={() => setEditing(null)}
        />
      )}

      {expenses.length === 0 && (
        <div className="empty-state">No expenses yet. Add one above!</div>
      )}

      <div className="expense-table">
        {expenses.map(e => (
          <div className="expense-row" key={e.id}>
            <span className="exp-cat-icon">{CAT_EMOJI[e.category] || "🏷️"}</span>
            <div className="exp-details">
              <span className="exp-desc">{e.description || e.category}</span>
              <span className="exp-meta">
                {CATEGORY_MAP[e.category] || e.category} · {e.date}
                {e.isRecurring && <span className="recurring-badge">🔁 Recurring</span>}
              </span>
            </div>
            <span className="exp-amount">{fmt(e.amount)}</span>
            <div className="exp-actions">
              <button className="icon-btn edit" onClick={() => setEditing(e)} title="Edit">✏️</button>
              <button
                className="icon-btn del"
                onClick={() => handleDelete(e.id)}
                disabled={deleting === e.id}
                title="Delete"
              >🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
