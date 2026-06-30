import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as apiLogin } from "../api/drupal";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/auth.css";

export default function Login() {
  const [form, setForm] = useState({ name: "", pass: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  
  const handle = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await apiLogin(form.name, form.pass);
    login();
    toast.success(`Welcome back, ${form.name}!`);
    nav("/");
  } catch {
    toast.error("Invalid username or password.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">💸</div>
        <h1 className="auth-title">SpendSense</h1>
        <p className="auth-sub">Track every rupee, own every goal.</p>
        <form onSubmit={handle} className="auth-form">
          <input
            className="auth-input"
            placeholder="Username"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={form.pass}
            onChange={e => setForm({ ...form, pass: e.target.value })}
            required
          />
          <button className="auth-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="auth-switch">
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
