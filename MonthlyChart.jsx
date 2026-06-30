import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MonthlyChart({ data }) {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Monthly Spending</h3>
      {data.length === 0 ? (
        <div className="chart-empty">Add expenses to see trends</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v}`} />
            <Tooltip formatter={v => [`₹${v.toLocaleString("en-IN")}`, "Spent"]} />
            <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
