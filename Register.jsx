import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/auth.css";

const BASE = import.meta.env.VITE_DRUPAL_BASE || "http://localhost/drupal-test/web";

export default function Register() {
  const [form, setForm] = useState({ name: "", mail: "", pass: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Register via PHP proxy
      await axios.post(
        `${BASE}/register.php`,
        { name: form.name, mail: form.mail, pass: form.pass },
        { headers: { "Content-Type": "application/json" } }
      );

      // Step 2: Auto login with new credentials
      const creds = btoa(`${form.name}:${form.pass}`);

      const userRes = await axios.get(
        `${BASE}/jsonapi/user/user?filter[name]=${encodeURIComponent(form.name)}`,
        { headers: { Authorization: `Basic ${creds}` } }
      );

      const uid =
        userRes.data?.data?.[0]?.attributes?.drupal_internal__uid || "1";

      localStorage.setItem("basic_creds", creds);
      localStorage.setItem("username", form.name);
      localStorage.setItem("uid", uid);

      login();
      toast.success("Account created! Welcome aboard.");
      nav("/");
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg) {
        toast.error(msg);
      } else if (err.response?.status === 422) {
        toast.error("Username or email already taken.");
      } else if (err.response?.status === 403) {
        toast.error("Registration not allowed.");
      } else {
        toast.error("Registration failed. Try again.");
      }
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">💸</div>
        <h1 className="auth-title">SpendSense</h1>
        <p className="auth-sub">Start your financial clarity today.</p>
        <form onSubmit={handle} className="auth-form">
          <input
            className="auth-input"
            placeholder="Username"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={form.mail}
            onChange={(e) => setForm({ ...form, mail: e.target.value })}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password (min 6 characters)"
            value={form.pass}
            onChange={(e) => setForm({ ...form, pass: e.target.value })}
            required
            minLength={6}
          />
          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="auth-switch">
          Have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
