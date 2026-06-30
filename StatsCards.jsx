export default function StatsCards({ stats, loading }) {
  const fmt = (n) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  const cards = [
    { label: "Total Spent (All Time)", value: fmt(stats.totalAll), icon: "💰", color: "#6366f1" },
    { label: "This Month", value: fmt(stats.totalMonth), icon: "📅", color: "#f59e0b" },
    { label: "Avg / Day (This Month)", value: fmt(stats.avgDay), icon: "📆", color: "#10b981" },
    { label: "Avg / Month", value: fmt(stats.avgMonth), icon: "📈", color: "#ec4899" },
  ];

  return (
    <div className="stats-grid">
      {cards.map(c => (
        <div className="stat-card" key={c.label} style={{ borderTop: `3px solid ${c.color}` }}>
          <span className="stat-icon">{c.icon}</span>
          <div>
            <div className="stat-value" style={loading ? { opacity: 0.4 } : {}}>
              {loading ? "---" : c.value}
            </div>
            <div className="stat-label">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
