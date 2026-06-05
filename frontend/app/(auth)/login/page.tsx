"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/review")
    }
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f9fafb"}}>
      <div style={{background:"white",padding:"2rem",borderRadius:"12px",border:"1px solid #e5e7eb",width:"100%",maxWidth:"400px"}}>
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{width:"40px",height:"40px",background:"#1d9e75",borderRadius:"10px",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:"0.75rem"}}>
            <span style={{color:"white",fontSize:"14px"}}>CM</span>
          </div>
          <h1 style={{fontSize:"1.4rem",fontWeight:600,margin:"0"}}>CodeMentor AI</h1>
          <p style={{color:"#6b7280",fontSize:"0.875rem",marginTop:"0.25rem"}}>Masuk ke akun kamu</p>
        </div>
        {error && <div style={{background:"#fee2e2",color:"#991b1b",padding:"0.75rem",borderRadius:"8px",fontSize:"0.875rem",marginBottom:"1rem"}}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{marginBottom:"1rem"}}>
            <label style={{display:"block",fontSize:"0.875rem",fontWeight:500,marginBottom:"0.375rem"}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="nama@email.com" style={{width:"100%",padding:"0.625rem 0.75rem",border:"1px solid #d1d5db",borderRadius:"8px",fontSize:"0.875rem",boxSizing:"border-box"}} />
          </div>
          <div style={{marginBottom:"1.5rem"}}>
            <label style={{display:"block",fontSize:"0.875rem",fontWeight:500,marginBottom:"0.375rem"}}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Min. 6 karakter" style={{width:"100%",padding:"0.625rem 0.75rem",border:"1px solid #d1d5db",borderRadius:"8px",fontSize:"0.875rem",boxSizing:"border-box"}} />
          </div>
          <button type="submit" disabled={loading} style={{width:"100%",padding:"0.625rem",background:"#1d9e75",color:"white",border:"none",borderRadius:"8px",fontSize:"0.875rem",fontWeight:500,cursor:"pointer"}}>
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
        <p style={{textAlign:"center",fontSize:"0.875rem",color:"#6b7280",marginTop:"1rem"}}>
          Belum punya akun? <Link href="/register" style={{color:"#1d9e75",fontWeight:500}}>Daftar gratis</Link>
        </p>
      </div>
    </div>
  )
}
