import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientApi } from "/src/api/clientApi.js";
import { Field } from "/src/components/PortalUI.jsx";
import "/src/styles/clientPortal.css";

export default function ClientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await clientApi.login(email.trim(), password);
      localStorage.setItem("client_token", data.token);
      localStorage.setItem("client_user", JSON.stringify(data.user));
      navigate("/portal");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="vhrp-root">
      <div className="vhrp-login-wrap">
        <div className="vhrp-login-aside">
          <div className="vhrp-login-aside-mark">V</div>
          <div className="vhrp-login-aside-quote">
            <span className="vhrp-eyebrow">Vinalax HR Solutions</span>
            <h2 style={{ marginTop: '0.8rem' }}>Your payroll and payslips, <em>always within reach.</em></h2>
            <p>Companies can review every payroll run and download statutory reports; employees can view and download their own payslips — all in one place.</p>
          </div>
          <div className="vhrp-login-aside-foot">© {new Date().getFullYear()} Vinalax HR Solutions</div>
        </div>

        <div className="vhrp-login-panel">
          <div className="vhrp-login-card">
            <span className="vhrp-eyebrow">Secure access</span>
            <h1 style={{ marginTop: '0.4rem' }}>Client Portal</h1>
            <p className="vhrp-login-lead">Sign in to view your payroll and payslips.</p>

            {error && <div className="vhrp-alert vhrp-alert-error vhrp-mb">⚠️ {error}</div>}

            <form onSubmit={submit}>
              <Field label="Email address" required>
                <input className="vhrp-input" type="email" autoComplete="username" required autoFocus
                  value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
              </Field>
              <Field label="Password" required>
                <input className="vhrp-input" type="password" autoComplete="current-password" required
                  value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              </Field>
              <button className="vhrp-btn vhrp-btn-navy vhrp-btn-block" type="submit" disabled={busy}
                style={{ marginTop: '0.5rem', padding: '0.85rem 1.5rem', fontSize: '0.9rem' }}>
                {busy ? "Signing in…" : "Sign in →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
