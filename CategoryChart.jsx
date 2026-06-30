import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1","#f59e0b","#10b981","#ec4899","#3b82f6","#f97316","#8b5cf6","#14b8a6"];

export default function CategoryChart({ data }) {
  return (
    <div className="chart-card">
      <h3 className="chart-title">This Month by Category</h3>
      {data.length === 0 ? (
        <div className="chart-empty">No expenses this month</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data} cx="50%" cy="50%"
              innerRadius={55} outerRadius={85}
              dataKey="value" paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={v => [`₹${v.toLocaleString("en-IN")}`, ""]} />
            <Legend iconType="circle" iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
