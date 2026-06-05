import Link from "next/link"

export default function Home() {
  return (
    <div style={{fontFamily:"system-ui,sans-serif",background:"#0a0a0a",color:"white",minHeight:"100vh"}}>
      {/* Navbar */}
      <nav style={{padding:"1rem 2rem",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #1f1f1f",position:"sticky",top:0,background:"rgba(10,10,10,0.9)",backdropFilter:"blur(10px)",zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <div style={{width:"32px",height:"32px",background:"linear-gradient(135deg,#1d9e75,#0d7a5a)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"white",fontSize:"12px",fontWeight:700}}>CM</span>
          </div>
          <span style={{fontWeight:700,fontSize:"16px"}}>CodeMentor AI</span>
        </div>
        <div style={{display:"flex",gap:"12px"}}>
          <Link href="/login" style={{padding:"7px 16px",color:"#9ca3af",textDecoration:"none",fontSize:"14px",borderRadius:"8px",border:"1px solid #2a2a2a"}}>Masuk</Link>
          <Link href="/register" style={{padding:"7px 16px",background:"#1d9e75",color:"white",textDecoration:"none",fontSize:"14px",borderRadius:"8px",fontWeight:500}}>Daftar Gratis</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{textAlign:"center",padding:"5rem 1.5rem 4rem",maxWidth:"800px",margin:"0 auto"}}>
        <div style={{display:"inline-block",background:"rgba(29,158,117,0.15)",border:"1px solid rgba(29,158,117,0.3)",borderRadius:"99px",padding:"4px 14px",fontSize:"13px",color:"#1d9e75",marginBottom:"1.5rem"}}>
          ✨ Gratis untuk developer Indonesia
        </div>
        <h1 style={{fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:800,lineHeight:1.15,margin:"0 0 1.25rem",letterSpacing:"-0.02em"}}>
          Review kode kamu dengan<br/>
          <span style={{background:"linear-gradient(135deg,#1d9e75,#34d399)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AI yang paham konteks</span>
        </h1>
        <p style={{fontSize:"1.1rem",color:"#9ca3af",lineHeight:1.7,marginBottom:"2rem",maxWidth:"600px",margin:"0 auto 2rem"}}>
          Dapatkan feedback instan untuk kode kamu — bug, security issues, performance, dan best practices. Dalam Bahasa Indonesia, gratis.
        </p>
        <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <Link href="/register" style={{padding:"12px 28px",background:"#1d9e75",color:"white",textDecoration:"none",borderRadius:"10px",fontSize:"15px",fontWeight:600}}>
            Mulai Gratis →
          </Link>
          <Link href="/login" style={{padding:"12px 28px",background:"transparent",color:"white",textDecoration:"none",borderRadius:"10px",fontSize:"15px",border:"1px solid #2a2a2a"}}>
            Sudah punya akun
          </Link>
        </div>
        <p style={{color:"#4b5563",fontSize:"13px",marginTop:"1rem"}}>Tidak perlu kartu kredit · 10 review/bulan gratis</p>
      </section>

      {/* Demo screenshot placeholder */}
      <section style={{maxWidth:"900px",margin:"0 auto 5rem",padding:"0 1.5rem"}}>
        <div style={{background:"#111",border:"1px solid #1f1f1f",borderRadius:"16px",overflow:"hidden"}}>
          <div style={{background:"#161616",padding:"12px 16px",display:"flex",gap:"6px",alignItems:"center",borderBottom:"1px solid #1f1f1f"}}>
            <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#ff5f57"}}></div>
            <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#febc2e"}}></div>
            <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#28c840"}}></div>
            <span style={{color:"#4b5563",fontSize:"12px",marginLeft:"8px"}}>codementor-ai-xi.vercel.app/review</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"280px"}}>
            <div style={{padding:"20px",borderRight:"1px solid #1f1f1f"}}>
              <div style={{color:"#4b5563",fontSize:"12px",marginBottom:"12px"}}>Editor kode</div>
              <pre style={{color:"#e5e7eb",fontSize:"12px",lineHeight:1.7,margin:0,fontFamily:"monospace"}}{...{}}>{`function hitungDiskon(harga, persen) {
  var diskon = harga * persen / 100
  return harga - diskon
}

console.log(hitungDiskon(100000, "20"))`}</pre>
            </div>
            <div style={{padding:"20px"}}>
              <div style={{color:"#4b5563",fontSize:"12px",marginBottom:"12px"}}>Hasil review</div>
              <div style={{background:"rgba(29,158,117,0.1)",border:"1px solid rgba(29,158,117,0.2)",borderRadius:"8px",padding:"10px",marginBottom:"10px"}}>
                <div style={{fontSize:"12px",color:"#34d399",fontWeight:600}}>Skor: 60/100</div>
                <div style={{fontSize:"11px",color:"#6b7280",marginTop:"2px"}}>Kode memiliki beberapa masalah</div>
              </div>
              <div style={{background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.2)",borderRadius:"8px",padding:"10px",marginBottom:"8px"}}>
                <div style={{fontSize:"11px",color:"#f87171",fontWeight:600}}>🐛 Input persen tidak divalidasi</div>
                <div style={{fontSize:"11px",color:"#6b7280",marginTop:"2px"}}>Fix: Tambah validasi tipe data</div>
              </div>
              <div style={{background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:"8px",padding:"10px"}}>
                <div style={{fontSize:"11px",color:"#fbbf24",fontWeight:600}}>⚡ Gunakan const/let bukan var</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{maxWidth:"900px",margin:"0 auto 5rem",padding:"0 1.5rem"}}>
        <h2 style={{textAlign:"center",fontSize:"1.75rem",fontWeight:700,marginBottom:"3rem"}}>Semua yang kamu butuhkan</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"16px"}}>
          {[
            {icon:"🐛",title:"Bug Detection",desc:"Temukan bug sebelum masuk production. AI menganalisis logika dan edge cases."},
            {icon:"🔒",title:"Security Review",desc:"Deteksi SQL injection, XSS, dan kerentanan keamanan lainnya."},
            {icon:"⚡",title:"Performance Tips",desc:"Saran optimasi untuk kode yang lebih cepat dan efisien."},
            {icon:"📚",title:"Best Practices",desc:"Pelajari standar industri langsung dari review kode kamu."},
            {icon:"🇮🇩",title:"Bahasa Indonesia",desc:"Review dalam Bahasa Indonesia yang mudah dipahami developer junior."},
            {icon:"✨",title:"Kode Diperbaiki",desc:"Dapatkan versi kode yang sudah diperbaiki, siap copy-paste."},
          ].map((f,i) => (
            <div key={i} style={{background:"#111",border:"1px solid #1f1f1f",borderRadius:"12px",padding:"20px"}}>
              <div style={{fontSize:"24px",marginBottom:"10px"}}>{f.icon}</div>
              <div style={{fontWeight:600,marginBottom:"6px",fontSize:"15px"}}>{f.title}</div>
              <div style={{color:"#6b7280",fontSize:"13px",lineHeight:1.6}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{maxWidth:"700px",margin:"0 auto 5rem",padding:"0 1.5rem",textAlign:"center"}}>
        <h2 style={{fontSize:"1.75rem",fontWeight:700,marginBottom:"0.5rem"}}>Harga yang masuk akal</h2>
        <p style={{color:"#6b7280",marginBottom:"2.5rem",fontSize:"14px"}}>Mulai gratis, upgrade kalau butuh lebih</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
          <div style={{background:"#111",border:"1px solid #1f1f1f",borderRadius:"16px",padding:"24px",textAlign:"left"}}>
            <div style={{fontWeight:700,marginBottom:"4px"}}>Free</div>
            <div style={{fontSize:"2rem",fontWeight:800,marginBottom:"16px"}}>Rp 0<span style={{fontSize:"14px",color:"#6b7280",fontWeight:400}}>/bulan</span></div>
            <ul style={{listStyle:"none",padding:0,margin:"0 0 20px",display:"flex",flexDirection:"column",gap:"8px"}}>
              {["10 review/bulan","Semua bahasa pemrograman","Beginner & Standard mode"].map((t,i) => (
                <li key={i} style={{fontSize:"13px",color:"#9ca3af",display:"flex",gap:"8px"}}>
                  <span style={{color:"#1d9e75"}}>✓</span>{t}
                </li>
              ))}
            </ul>
            <Link href="/register" style={{display:"block",textAlign:"center",padding:"9px",background:"transparent",border:"1px solid #2a2a2a",borderRadius:"8px",color:"white",textDecoration:"none",fontSize:"13px"}}>Mulai Gratis</Link>
          </div>
          <div style={{background:"linear-gradient(135deg,rgba(29,158,117,0.15),rgba(29,158,117,0.05))",border:"1px solid rgba(29,158,117,0.3)",borderRadius:"16px",padding:"24px",textAlign:"left",position:"relative"}}>
            <div style={{position:"absolute",top:"-10px",left:"50%",transform:"translateX(-50%)",background:"#1d9e75",borderRadius:"99px",padding:"2px 12px",fontSize:"11px",fontWeight:600,whiteSpace:"nowrap"}}>SEGERA HADIR</div>
            <div style={{fontWeight:700,marginBottom:"4px"}}>Pro</div>
            <div style={{fontSize:"2rem",fontWeight:800,marginBottom:"16px"}}>Rp 49k<span style={{fontSize:"14px",color:"#6b7280",fontWeight:400}}>/bulan</span></div>
            <ul style={{listStyle:"none",padding:0,margin:"0 0 20px",display:"flex",flexDirection:"column",gap:"8px"}}>
              {["100 review/bulan","Senior mode","Review history","Priority support"].map((t,i) => (
                <li key={i} style={{fontSize:"13px",color:"#9ca3af",display:"flex",gap:"8px"}}>
                  <span style={{color:"#1d9e75"}}>✓</span>{t}
                </li>
              ))}
            </ul>
            <Link href="/register" style={{display:"block",textAlign:"center",padding:"9px",background:"#1d9e75",borderRadius:"8px",color:"white",textDecoration:"none",fontSize:"13px",fontWeight:500}}>Daftar Waitlist</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{textAlign:"center",padding:"4rem 1.5rem 5rem",borderTop:"1px solid #1f1f1f"}}>
        <h2 style={{fontSize:"1.75rem",fontWeight:700,marginBottom:"1rem"}}>Siap improve kode kamu?</h2>
        <p style={{color:"#6b7280",marginBottom:"2rem",fontSize:"14px"}}>Bergabung dengan developer Indonesia yang sudah pakai CodeMentor AI</p>
        <Link href="/register" style={{padding:"12px 32px",background:"#1d9e75",color:"white",textDecoration:"none",borderRadius:"10px",fontSize:"15px",fontWeight:600}}>
          Daftar Gratis Sekarang →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{borderTop:"1px solid #1f1f1f",padding:"1.5rem",textAlign:"center",color:"#4b5563",fontSize:"13px"}}>
        © 2026 CodeMentor AI · Dibuat dengan ❤️ untuk developer Indonesia
      </footer>
    </div>
  )
}
