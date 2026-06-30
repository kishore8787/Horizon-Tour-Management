import { CATEGORY_MAP } from "../pages/Dashboard";

export default function AlertBanner({ alerts, catSpend }) {
  const fmt = (n) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  return (
    <div className="alert-banner">
      <span className="alert-icon">🚨</span>
      <div>
        <strong>Over-budget alert!</strong> You've exceeded your budget in:{" "}
        {alerts.map((a, i) => (
          <span key={a.category}>
            <strong>{CATEGORY_MAP[a.category] || a.category}</strong> ({fmt(catSpend[a.category])} / {fmt(a.limit)})
            {i < alerts.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
