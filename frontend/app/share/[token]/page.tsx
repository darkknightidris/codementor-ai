import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

function scoreColor(score: number) {
  return score >= 80 ? "#1d9e75" : score >= 50 ? "#d97706" : "#dc2626"
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const { data: review } = await supabase
    .from("code_reviews")
    .select("*")
    .eq("share_token", token)
    .eq("is_public", true)
    .single()

  if (!review) return notFound()

  const result = review.review_result

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui,sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "#1d9e75", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: "11px", fontWeight: 600 }}>CM</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>CodeMentor AI</span>
        </div>
        <a href="/register" style={{ padding: "7px 16px", background: "#1d9e75", color: "white", textDecoration: "none", fontSize: "13px", borderRadius: "8px", fontWeight: 500 }}>Coba Gratis</a>
      </nav>
      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1.5rem" }}>
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#f9fafb", border: `2px solid ${scoreColor(review.score)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "18px", fontWeight: 700, color: scoreColor(review.score), lineHeight: 1 }}>{review.score}</span>
              <span style={{ fontSize: "9px", color: "#9ca3af" }}>/ 100</span>
            </div>
            <div>
              <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
                <span style={{ background: "#f3f4f6", padding: "2px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: 500 }}>{review.language}</span>
                <span style={{ background: "#eff6ff", padding: "2px 8px", borderRadius: "99px", fontSize: "11px", color: "#1d4ed8" }}>{review.mode}</span>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: "#374151" }}>{result?.summary}</p>
            </div>
          </div>
          <pre style={{ margin: 0, fontSize: "12px", fontFamily: "monospace", lineHeight: 1.6, background: "#f9fafb", padding: "12px", borderRadius: "8px", overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all", color: "#374151" }}>{review.original_code}</pre>
        </div>
        {result?.bugs?.length > 0 && (
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: "1rem" }}>
            <div style={{ padding: "10px 16px", background: "#fef2f2", borderBottom: "1px solid #fee2e2", fontSize: "13px", fontWeight: 500, color: "#991b1b" }}>🐛 Bug ditemukan ({result.bugs.length})</div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {result.bugs.map((b: any, i: number) => (
                <div key={i} style={{ background: "#fef2f2", borderRadius: "8px", padding: "10px 12px", fontSize: "13px" }}>
                  <strong style={{ color: "#991b1b" }}>{b.issue}</strong>
                  {b.fix && <div style={{ color: "#6b7280", marginTop: "3px" }}>Fix: {b.fix}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        {result?.improved_code && (
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: "1rem" }}>
            <div style={{ padding: "10px 16px", background: "#f0fdf4", borderBottom: "1px solid #bbf7d0", fontSize: "13px", fontWeight: 500, color: "#15803d" }}>✨ Kode yang diperbaiki</div>
            <pre style={{ margin: 0, padding: "12px 16px", fontSize: "12px", fontFamily: "monospace", lineHeight: 1.6, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all", color: "#374151" }}>{result.improved_code}</pre>
          </div>
        )}
        <div style={{ textAlign: "center", padding: "2rem", background: "white", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <p style={{ margin: "0 0 12px", fontSize: "14px", color: "#6b7280" }}>Review kode kamu sendiri — gratis!</p>
          <a href="/register" style={{ padding: "10px 24px", background: "#1d9e75", color: "white", textDecoration: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 500 }}>Daftar Gratis Sekarang →</a>
        </div>
      </div>
    </div>
  )
}
