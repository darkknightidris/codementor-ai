"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const LANGUAGES = ["javascript","typescript","python","php","java","go","rust","kotlin","cpp","c"]
const MODES = [
  { value: "beginner", label: "Beginner", desc: "Penjelasan ramah, analogi sederhana" },
  { value: "standard", label: "Standard", desc: "Review komprehensif, campuran Indonesia + English" },
  { value: "senior", label: "Senior", desc: "Strict review seperti production code" },
]

export default function ReviewPage() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [mode, setMode] = useState("standard")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login")
      else setUser(data.user)
    })
  }, [])

  async function handleReview(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, mode }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === "quota_exceeded") setError("Quota habis. Upgrade ke Pro untuk review lebih banyak.")
        else setError(data.error || "Terjadi kesalahan")
      } else {
        setResult(data.review.review_result)
      }
    } catch (err) {
      setError("Gagal terhubung ke server")
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const scoreColor = result ? (result.score >= 80 ? "#1d9e75" : result.score >= 50 ? "#d97706" : "#dc2626") : "#1d9e75"

  return (
    <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"system-ui,sans-serif"}}>
      {/* Navbar */}
      <nav style={{background:"white",borderBottom:"1px solid #e5e7eb",padding:"0.75rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <div style={{width:"28px",height:"28px",background:"#1d9e75",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"white",fontSize:"11px",fontWeight:600}}>CM</span>
          </div>
          <span style={{fontWeight:600,fontSize:"15px"}}>CodeMentor AI</span>
          </div>
          <div style={{display:"flex",gap:"4px"}}>
            <Link href="/review" style={{padding:"5px 12px",fontSize:"13px",color:"#1d9e75",textDecoration:"none",borderRadius:"6px",background:"#f0fdf4",fontWeight:500}}>Review</Link>
            <Link href="/history" style={{padding:"5px 12px",fontSize:"13px",color:"#6b7280",textDecoration:"none",borderRadius:"6px"}}>History</Link>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <span style={{fontSize:"13px",color:"#6b7280"}}>{user?.email}</span>
          <button onClick={handleLogout} style={{fontSize:"13px",color:"#6b7280",background:"none",border:"1px solid #e5e7eb",borderRadius:"6px",padding:"4px 10px",cursor:"pointer"}}>Keluar</button>
        </div>
      </nav>

      <div style={{maxWidth:"1100px",margin:"0 auto",padding:"1.5rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",height:"calc(100vh - 57px)"}}>
        {/* Editor panel */}
        <div style={{background:"white",borderRadius:"12px",border:"1px solid #e5e7eb",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:"13px",fontWeight:500}}>Editor kode</span>
            <select value={language} onChange={e=>setLanguage(e.target.value)} style={{fontSize:"12px",padding:"3px 8px",border:"1px solid #e5e7eb",borderRadius:"6px",background:"#f9fafb"}}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <textarea
            value={code}
            onChange={e=>setCode(e.target.value)}
            placeholder="// Paste kode kamu di sini..."
            style={{flex:1,fontFamily:"'Courier New',monospace",fontSize:"13px",lineHeight:1.6,padding:"16px",border:"none",outline:"none",resize:"none",background:"white",color:"#1f2937"}}
          />
          <div style={{padding:"12px 16px",borderTop:"1px solid #e5e7eb",display:"flex",alignItems:"center",gap:"10px"}}>
            <select value={mode} onChange={e=>setMode(e.target.value)} style={{flex:1,fontSize:"12px",padding:"6px 8px",border:"1px solid #e5e7eb",borderRadius:"6px",background:"#f9fafb"}}>
              {MODES.map(m => <option key={m.value} value={m.value}>{m.label} — {m.desc}</option>)}
            </select>
            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              style={{padding:"7px 16px",background: loading || !code.trim() ? "#9ca3af" : "#1d9e75",color:"white",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:500,cursor: loading || !code.trim() ? "not-allowed" : "pointer",whiteSpace:"nowrap"}}
            >
              {loading ? "Menganalisis..." : "Review"}
            </button>
          </div>
        </div>

        {/* Result panel */}
        <div style={{background:"white",borderRadius:"12px",border:"1px solid #e5e7eb",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid #e5e7eb"}}>
            <span style={{fontSize:"13px",fontWeight:500}}>Hasil review</span>
          </div>
          <div style={{flex:1,padding:"16px",overflowY:"auto"}}>
            {!result && !error && !loading && (
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:"#9ca3af",gap:"8px"}}>
                <span style={{fontSize:"32px"}}>{"</>"}</span>
                <p style={{fontSize:"13px",margin:0}}>Paste kode dan klik Review</p>
              </div>
            )}
            {loading && (
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#6b7280",fontSize:"14px"}}>
                Menganalisis kode...
              </div>
            )}
            {error && (
              <div style={{background:"#fee2e2",color:"#991b1b",padding:"12px",borderRadius:"8px",fontSize:"13px"}}>{error}</div>
            )}
            {result && (
              <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                {/* Score */}
                <div style={{border:"1px solid #e5e7eb",borderRadius:"8px",overflow:"hidden"}}>
                  <div style={{padding:"8px 12px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb",fontSize:"12px",fontWeight:500}}>Skor kode</div>
                  <div style={{padding:"12px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",marginBottom:"6px"}}>
                      <span style={{color:"#6b7280"}}>{result.summary}</span>
                      <span style={{fontWeight:600,color:scoreColor}}>{result.score}/100</span>
                    </div>
                    <div style={{height:"6px",borderRadius:"99px",background:"#f3f4f6",overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${result.score}%`,background:scoreColor,borderRadius:"99px"}}></div>
                    </div>
                  </div>
                </div>

                {/* Issues */}
                {[
                  { key: "bugs", label: "Bug ditemukan", color: "#fee2e2", textColor: "#991b1b" },
                  { key: "security", label: "Security issues", color: "#fef3c7", textColor: "#92400e" },
                  { key: "performance", label: "Performance", color: "#dbeafe", textColor: "#1e40af" },
                  { key: "best_practices", label: "Best practices", color: "#f3e8ff", textColor: "#6b21a8" },
                ].map(({ key, label, color, textColor }) =>
                  result[key]?.length > 0 && (
                    <div key={key} style={{border:"1px solid #e5e7eb",borderRadius:"8px",overflow:"hidden"}}>
                      <div style={{padding:"8px 12px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb",fontSize:"12px",fontWeight:500}}>{label} ({result[key].length})</div>
                      <div style={{padding:"10px 12px",display:"flex",flexDirection:"column",gap:"6px"}}>
                        {result[key].map((item: any, i: number) => (
                          <div key={i} style={{background:color,borderRadius:"6px",padding:"8px 10px",fontSize:"12.5px",color:textColor,lineHeight:1.5}}>
                            <strong>{item.issue}</strong>
                            {item.fix && <div style={{marginTop:"3px",opacity:0.85}}>Fix: {item.fix}</div>}
                            {item.suggestion && <div style={{marginTop:"3px",opacity:0.85}}>Saran: {item.suggestion}</div>}
                            {item.better && <div style={{marginTop:"3px",opacity:0.85}}>Lebih baik: {item.better}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Improved code */}
                {result.improved_code && (
                  <div style={{border:"1px solid #e5e7eb",borderRadius:"8px",overflow:"hidden"}}>
                    <div style={{padding:"8px 12px",background:"#f0fdf4",borderBottom:"1px solid #e5e7eb",fontSize:"12px",fontWeight:500,color:"#15803d"}}>Kode yang diperbaiki</div>
                    <pre style={{margin:0,padding:"12px",fontSize:"12px",fontFamily:"'Courier New',monospace",lineHeight:1.6,overflowX:"auto",background:"#fafafa",whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{result.improved_code}</pre>
                  </div>
                )}

                {/* Encouragement */}
                {result.encouragement && (
                  <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"8px",padding:"10px 12px",fontSize:"13px",color:"#15803d"}}>
                    {result.encouragement}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

