import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "/src/components/Navbar.jsx";
import Footer from "/src/components/Footer.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ── LIVE SERVER AUTHENTICATION ROUTING ──
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://vinalaxbackend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save the real signed JWT encryption token securely into browser storage
        localStorage.setItem("token", data.token);
        navigate("/admin");
      } else {
        setError(data.message || "Invalid credential mappings. Please verify email and security password keys.");
      }
    } catch (error) {
      console.error("Login Network Error:", error);
      setError("Cannot reach authorization server. Please verify backend state is active on port 5000.");
    }
  };

  return (
    <>
      <Navbar />

      <section style={{ 
        background: "var(--navy)", 
        minHeight: "85vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        padding: "6rem 5% 4rem"
      }}>
        <div style={{ 
          background: "var(--white)", 
          padding: "3rem 2.5rem", 
          borderRadius: "12px", 
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: "420px"
        }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span style={{ fontSize: "2.5rem" }}>🔒</span>
            <h2 style={{ 
              fontFamily: "Cormorant Garamond, serif", 
              color: "var(--navy)", 
              fontSize: "2rem", 
              fontWeight: "600",
              marginTop: "1rem" 
            }}>
              Admin Terminal
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
              Authorized management authentication gateway
            </p>
          </div>

          {error && (
            <div style={{ 
              background: "#ffeeee", 
              color: "#cc0000", 
              padding: "0.75rem 1rem", 
              borderRadius: "6px", 
              fontSize: "0.8rem", 
              marginBottom: "1.5rem",
              border: "1px solid #ffcccc",
              lineHeight: "1.4"
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label style={{ color: "var(--navy)", fontWeight: "500", fontSize: "0.85rem" }}>
                Identity Email Address
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="admin@vinalax.com" 
                required 
                style={{ width: "100%", marginTop: "0.4rem" }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label style={{ color: "var(--navy)", fontWeight: "500", fontSize: "0.85rem" }}>
                Security Access Token
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                style={{ width: "100%", marginTop: "0.4rem" }}
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              style={{ width: "100%", padding: "1rem", fontWeight: "600", cursor: "pointer" }}
            >
              Authenticate Portal Access →
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
