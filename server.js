let votes = { A: 0, B: 0, C: 0 };
let total = 0;
let usedTokens = new Set();
const ADMIN_KEY = "Major2025!";

app.get('/', (req, res) => {
 res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>
*{box-sizing:border-box}body{margin:0;font-family:Arial;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3)}
.top{background:#0a1931;padding:26px 24px}.pill{display:inline-block;border:1px solid rgba(255,255,255,.25);color:#cbd5e1;font-size:11px;padding:6px 12px;border-radius:20px}
.title{margin:18px 0 6px;color:#fff;font-size:34px;font-weight:800}.blue{color:#5fa8ff}.sub{color:#8aa0c6;font-size:14px}
.bottom{padding:28px 22px}.label{color:#5b6b86;font-size:12px;letter-spacing:1.5px;font-weight:700;margin-bottom:10px}
input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px;font-size:16px}
button{width:100%;margin-top:16px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:700}
.foot{display:flex;justify-content:space-between;padding:14px 22px;background:#f8fafc;color:#94a3b8;font-size:11px}
</style></head><body><div class="card"><div class="top"><div class="pill">TABLE 1 | VERIFICATION DESK</div><div class="title">Major<span class="blue">Tech</span><br>Verify</div><div class="sub">Liberia Institute | Token Engine</div></div><div class="bottom"><div class="label">ENTER STUDENT ID</div><input id="sid" placeholder="e.g. LISE-037-2025"><button onclick="verify()">VERIFY ></button></div><div class="foot"><span>SECURE</span><span>MAJORTECH</span></div></div>
<script>
async function verify(){
 let id=document.getElementById('sid').value;
 if(!id) return alert('Enter ID');
 let r=await fetch('/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentId:id})});
 let d=await r.json();
 if(d.error) alert(d.error); else location.href='/table2?token='+d.token;
}
</script></body></html>`);
});
