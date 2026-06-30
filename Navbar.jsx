import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar({ tab, setTab, onExport }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out.");
    nav("/login");
  };

  const tabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "expenses", label: "➕ Expenses" },
    { id: "budgets", label: "🎯 Budgets" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-logo">💸</span>
        <span className="nav-name">SpendSense</span>
      </div>
      <div className="nav-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`nav-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <button className="nav-export" onClick={onExport} title="Export CSV">⬇ CSV</button>
        <span className="nav-user">👤 {user?.username}</span>
        <button className="nav-logout" onClick={handleLogout}>Sign out</button>
      </div>
    </nav>
  );
}
