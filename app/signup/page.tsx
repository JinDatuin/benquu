"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) window.location.href = "/dashboard";
    else setError((await res.json()).error);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      {/* Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "48px 48px 40px",
            backgroundColor: "#fff",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              fontSize: "40px",
              fontWeight: 400,
              margin: "0 0 8px",
            }}
          >
            Sign up
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "#444",
              fontSize: "14px",
              margin: "0 0 40px",
            }}
          >
            Sign up to continue
          </p>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: "28px" }}>
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "1px solid #aaa",
                  outline: "none",
                  fontSize: "15px",
                  padding: "8px 0",
                  color: "#333",
                  backgroundColor: "transparent",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "28px" }}>
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "1px solid #aaa",
                  outline: "none",
                  fontSize: "15px",
                  padding: "8px 0",
                  color: "#333",
                  backgroundColor: "transparent",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "32px" }}>
              <input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "1px solid #aaa",
                  outline: "none",
                  fontSize: "15px",
                  padding: "8px 0",
                  color: "#333",
                  backgroundColor: "transparent",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <p
                style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#1a6fd4",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: "16px",
              }}
            >
              Sign up
            </button>

            {/* Remember me */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                cursor: "pointer",
                marginBottom: "28px",
              }}
            >
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{
                  accentColor: "#1a6fd4",
                  width: "16px",
                  height: "16px",
                }}
              />
              Remember me
            </label>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }} />
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.08em",
                color: "#888",
                fontWeight: 600,
              }}
            >
              ACCESS QUICKLY
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }} />
          </div>

          {/* Social buttons */}
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            {["Google", "Linkedin", "SSO"].map((provider) => (
              <button
                key={provider}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#fff",
                  color: "#1a6fd4",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {provider}
              </button>
            ))}
          </div>
        </div>

        {/* Footer link */}
        <p style={{ marginTop: "24px", fontSize: "14px", color: "#555" }}>
          Already have an account?{" "}
          <Link
            href="/signin"
            style={{ color: "#1a6fd4", textDecoration: "none" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
