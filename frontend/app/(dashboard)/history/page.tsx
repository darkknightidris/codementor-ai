"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function HistoryPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push("/login"); return }
      setUser(session.user)
      
      const { data, error } = await supabase
        .from("code_reviews")
        .select("id, language, mode, score, review_result, created_at, original_code")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(50)
      
      console.log("Reviews:", data, "Error:", error)
      setReviews(data || [])
      setLoading(false)
    }
    init()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })
  }

  const scoreColor = (score: number) =>
    score >= 80 ? "#1d9e75" : score >= 50 ? "#d97706" : "#dc2626"

  return (
    <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{background:"white",borderBottom:"1px solid #e5e7eb",padding:"0.75rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <div style={{width:"28px",height:"28px",background:"#1d9e75",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"white",fontSize:"11px",fontWeight:600}}>CM</span>
            </div>
            <span style={{fontWeight:600,fontSize:"15px"}}>CodeMentor AI</span>
          </div>
          <div style={{display:"flex",gap:"4px"}}>
            <Link href="/review" style={{padding:"5px 12px",fontSize:"13px",color:"#6b7280",textDecoration:"none",borderRadius:"6px"}}>Review</Link>
            <Link href="/history" style={{padding:"5px 12px",fontSize:"13px",color:"#1d9e75",textDecoration:"none",borderRadius:"6px",background:"#f0fdf4",fontWeight:500}}>History</Link>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <span style={{fontSize:"13px",color:"#6b7280"}}>{user?.email}</span>
          <button onClick={handleLogout} style={{fontSize:"13px",color:"#6b7280",background:"none",border:"1px solid #e5e7eb",borderRadius:"6px",padding:"4px 10px",cursor:"pointer"}}>Keluar</button>
        </div>
      </nav>

      <div style={{maxWidth:"900px",margin:"0 auto",padding:"1.5rem"}}>
        <div style={{marginBottom:"1.5rem"}}>
          <h1 style={{fontSize:"1.25rem",fontWeight:600,margin:"0 0 4px"}}>History Review</h1>
          <p style={{color:"#6b7280",fontSize:"13px",margin:0}}>Semua review kode kamu</p>
        </div>

        {loading && (
          <div style={{textAlign:"center",padding:"3rem",color:"#6b7280",fontSize:"14px"}}>Memuat...</div>
        )}

        {!loading && reviews.length === 0 && (
          <div style={{textAlign:"center",padding:"4rem",background:"white",borderRadius:"12px",border:"1px solid #e5e7eb"}}>
            <div style={{fontSize:"32px",marginBottom:"12px"}}>{"</>"}</div>
            <p style={{color:"#6b7280",fontSize:"14px",margin:"0 0 16px"}}>Belum ada review. Yuk mulai review kode pertama kamu!</p>
            <Link href="/review" style={{padding:"8px 20px",background:"#1d9e75",color:"white",textDecoration:"none",borderRadius:"8px",fontSize:"14px",fontWeight:500}}>Review Sekarang</Link>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            {reviews.map((review) => (
              <div key={review.id} style={{background:"white",borderRadius:"12px",border:"1px solid #e5e7eb",padding:"16px",display:"flex",gap:"16px",alignItems:"flex-start"}}>
                <div style={{width:"52px",height:"52px",borderRadius:"12px",background:"#f9fafb",border:`2px solid ${scoreColor(review.score)}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:"16px",fontWeight:700,color:scoreColor(review.score),lineHeight:1}}>{review.score}</span>
                  <span style={{fontSize:"9px",color:"#9ca3af",marginTop:"1px"}}>/ 100</span>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px",flexWrap:"wrap"}}>
                    <span style={{background:"#f3f4f6",padding:"2px 8px",borderRadius:"99px",fontSize:"11px",fontWeight:500,color:"#374151"}}>{review.language}</span>
                    <span style={{background:"#eff6ff",padding:"2px 8px",borderRadius:"99px",fontSize:"11px",color:"#1d4ed8"}}>{review.mode}</span>
                    <span style={{color:"#9ca3af",fontSize:"12px",marginLeft:"auto"}}>{formatDate(review.created_at)}</span>
                  </div>
                  <p style={{margin:"0 0 8px",fontSize:"13px",color:"#374151",lineHeight:1.5}}>
                    {review.review_result?.summary || "Review selesai"}
                  </p>
                  <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                    {review.review_result?.bugs?.length > 0 && (
                      <span style={{fontSize:"11px",color:"#dc2626",background:"#fee2e2",padding:"2px 8px",borderRadius:"99px"}}>
                        🐛 {review.review_result.bugs.length} bug
                      </span>
                    )}
                    {review.review_result?.security?.length > 0 && (
                      <span style={{fontSize:"11px",color:"#92400e",background:"#fef3c7",padding:"2px 8px",borderRadius:"99px"}}>
                        🔒 {review.review_result.security.length} security
                      </span>
                    )}
                    {review.review_result?.performance?.length > 0 && (
                      <span style={{fontSize:"11px",color:"#1e40af",background:"#dbeafe",padding:"2px 8px",borderRadius:"99px"}}>
                        ⚡ {review.review_result.performance.length} performance
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
