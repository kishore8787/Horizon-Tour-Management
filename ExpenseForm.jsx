import { useState } from "react";
import { createExpense, updateExpense } from "../api/drupal";
import { CATEGORY_KEYS, CATEGORY_MAP } from "../pages/Dashboard";
import toast from "react-hot-toast";

const blank = {
  amount: "", category: "food_dining",
  description: "", date: new Date().toISOString().slice(0, 10),
  isRecurring: false,
};

export default function ExpenseForm({ onRefresh, editing, onCancel }) {
  const [form, setForm] = useState(editing || blank);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount)) return toast.error("Enter a valid amount.");
    setSaving(true);
    try {
      if (editing) {
        await updateExpense(editing.id, form);
        toast.success("Expense updated.");
        onCancel?.();
      } else {
        await createExpense(form);
        toast.success("Expense added.");
        setForm(blank);
      }
      onRefresh();
    } catch (err) {
      toast.error("Failed to save expense.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={submit}>
      <h2 className="form-title">{editing ? "Edit Expense" : "Add Expense"}</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number" min="0" step="0.01" placeholder="0.00"
            value={form.amount}
            onChange={e => set("amount", e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORY_KEYS.map(k => <option key={k} value={k}>{CATEGORY_MAP[k]}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date" value={form.date}
            onChange={e => set("date", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group" style={{ flex: 2 }}>
          <label>Description</label>
          <input
            placeholder="What did you spend on?"
            value={form.description}
            onChange={e => set("description", e.target.value)}
          />
        </div>
        <div className="form-group form-check">
          <label>
            <input
              type="checkbox" checked={form.isRecurring}
              onChange={e => set("isRecurring", e.target.checked)}
            />
            {" "}Recurring
          </label>
        </div>
      </div>
      <div className="form-actions">
        <button className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : editing ? "Update" : "Add Expense"}
        </button>
        {editing && (
          <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
