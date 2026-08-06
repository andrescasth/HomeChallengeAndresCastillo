"use client";

import * as React from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function LandingPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setStatus("success");
      setName("");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message ?? "Failed to send email");
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>Send billing notice</h1>
        <p style={styles.subtitle}>
          Enter the customer details and we’ll send the email.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
              style={styles.input}
            />
          </label>

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              ...styles.button,
              opacity: status === "sending" ? 0.6 : 1,
              cursor: status === "sending" ? "not-allowed" : "pointer",
            }}
          >
            {status === "sending" ? "Sending…" : "Send"}
          </button>
        </form>

        {status === "success" && (
          <p style={styles.success}>✅ Email sent successfully!</p>
        )}
        {status === "error" && (
          <p style={styles.error}>❌ {errorMsg}</p>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f6f6",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "24px",
    margin: "0 0 8px",
    color: "#111827",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#111827",
  },
  input: {
    padding: "10px 12px",
    fontSize: "16px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    outline: "none",
  },
  button: {
    marginTop: "8px",
    backgroundColor: "#000000",
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: "6px",
    border: "none",
    fontSize: "16px",
    fontWeight: 600,
  },
  success: {
    marginTop: "16px",
    color: "#059669",
    fontSize: "14px",
  },
  error: {
    marginTop: "16px",
    color: "#dc2626",
    fontSize: "14px",
  },
};
