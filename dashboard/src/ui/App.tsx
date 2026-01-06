import { useMemo, useState } from "react";

type Sentiment = "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED";
type SentimentScores = { Positive: number; Negative: number; Neutral: number; Mixed: number };
type AnalyzeResponse = { sentiment: Sentiment; scores: SentimentScores };
type ApiError = { error: string };

function round(n: number) {
  return Math.round(n * 10000) / 10000;
}

export function App() {
  const apiBase = import.meta.env.VITE_API_URL as string | undefined;
  const [text, setText] = useState("I love using AWS services.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canCall = useMemo(() => Boolean(apiBase && apiBase.startsWith("http")), [apiBase]);

  async function analyze() {
    setError(null);
    setResult(null);
    if (!apiBase) return setError("VITE_API_URL is not set. Create dashboard/.env.local with your CDK output.");

    setLoading(true);
    try {
      const r = await fetch(`${apiBase}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      const data = (await r.json()) as AnalyzeResponse | ApiError;

      if (!r.ok) {
        setError("error" in data ? data.error : `API error (${r.status})`);
        return;
      }

      setResult(data as AnalyzeResponse);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 920 }}>
      <h1>Amazon Comprehend Sentiment</h1>
      <p style={{ opacity: 0.8 }}>
        API Base: <code>{apiBase ?? "(not set)"}</code>
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze…"
        />
        <button
          onClick={analyze}
          disabled={!canCall || loading}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #333", cursor: "pointer" }}
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </div>

      {!canCall && (
        <p style={{ marginTop: 12 }}>
          Set <code>VITE_API_URL</code> in <code>dashboard/.env.local</code> to your CDK output.
        </p>
      )}

      {error && (
        <pre style={{ background: "#fee", padding: 12, borderRadius: 8, marginTop: 16 }}>
          {error}
        </pre>
      )}

      {result && (
        <div style={{ marginTop: 16 }}>
          <h2>Sentiment: {result.sentiment}</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Label</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result.scores).map(([k, v]) => (
                <tr key={k}>
                  <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{k}</td>
                  <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{round(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <details style={{ marginTop: 10 }}>
            <summary>Raw JSON</summary>
            <pre style={{ background: "#f6f8fa", padding: 12, borderRadius: 8 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
