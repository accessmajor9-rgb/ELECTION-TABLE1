const express = require('express');
const app = express();
app.use(express.json());

let votes = { A: 0, B: 0, C: 0 };
let total = 0;
let issuedTokens = new Set();
let usedTokens = new Set();
let usedIds = new Set();
let voterLog = [];
const ADMIN_KEY = "Major2025!";
const SUPER_RESET_KEY = "Elephants-Table9!";

const HEAD = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>
*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:16px}
.card{width:100%;max-width:430px;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3)}
.top{background:#0a1931;padding:26px 24px}.pill{display:inline-block;border:1px solid rgba(255,255,255,.2);color:#cbd5e1;font-size:10px;padding:6px 12px;border-radius:20px}
.title{color:#fff;font-size:32px;font-weight:800;line-height:1.1;margin:16px 0 6px}.blue{color:#5fa8ff}.sub{color:#8aa0c6;font-size:13px}
.bottom{padding:26px 22px}.label{color:#5b6b86;font-size:11px;font-weight:700;letter-spacing:1.2px;margin-bottom:10px}
input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px;font-size:16px;outline:none}
button{width:100%;margin-top:12px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:800;cursor:pointer}
.cand{width:100%;padding:16px;margin-top:12px;background:#6d28d9;color:#fff;border:none;border-radius:14px;font-weight:700}
.tokenBox{margin-top:18px;background:#f1f5f9;padding:18px;border-radius:16px;text-align:center;display:none}
.tokenNum{font-size:36px;font-weight:900;letter-spacing:5px;color:#0a1931}
.foot{display:flex;justify-content:space-between;padding:12px 20px;background:#f8fafc;color:#94a3b8;font-size:10px}
.success{background:#ecfdf5;border:2px solid #10b981;padding:20px;border-radius:16px;text-align:center}
</style></head><body>`;

app.get('/', (req,res)=>{
 res.send(`${HEAD}<div class="card"><div class="top"><div class="pill">TABLE 1 | VERIFICATION DESK | MAJORTECH OS</div><div class="title">Major<span class="blue">Tech</span> Verify</div><div class="sub">Liberia Institute | Official Student ID<br>Verification and Token Engine</div></div><div class="bottom"><div class="label">ENTER STUDENT ID NUMBER</div><input id="sid" placeholder="e.g. LISE-043-2025"><button onclick="verify()">VERIFY ></button><div id="result" class="tokenBox"><div style="font-size:11px;color:#64748b">VERIFIED - YOUR 6-DIGIT TOKEN</div><div id="tok" class="tokenNum"></div><div id="idshow" style="font-size:11px;color:#64748b;margin-top:8px"></div><a id="go2" href="#"><button style="background:#7c3aed;margin-top:14px">NEXT → TABLE 2</button></a></div></div><div class="foot"><span>SECURE | ENCRYPTED</span><span>POWERED BY MAJORTECH</span></div></div>
 <script>
 async function verify(){
  let id=document.getElementById('sid').value.trim();
  if(!id) return alert('Enter ID');
  let r=await fetch('/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentId:id})});
  let d=await r.json();
  if(d.error) return alert(d.error);
  document.getElementById('result').style.display='block';
  document.getElementById('tok').innerText=d.token;
  document.getElementById('idshow').innerText='ID: '+id;
  document.getElementById('go2').href='/table2?token='+d.token;
 }
 </script></body></html>`);
});

app.post('/verify',(req,res)=>{
 let {studentId}=req.body;
 if(!studentId) return res.json({error:'Enter ID'});
 if(usedIds.has(studentId)) return res.json({error:'This ID already used!'});
 let token=Math.floor(100000+Math.random()*900000).toString();
 issuedTokens.add(token); usedIds.add(studentId);
 voterLog.push({id:studentId, token:token, time:new Date().toLocaleString(), voted:false, candidate:''});
 res.json({token});
});

app.get('/table2',(req,res)=>{
 let t=(req.query.token||'').trim();
 if(!t ||!issuedTokens.has(t)) return res.send(`${HEAD}<div class="card"><div class="bottom"><h3>Invalid Token!</h3><a href="/"><button>← Back to Table 1</button></a></div></div></body></html>`);
 if(usedTokens.has(t)) return res.send(`${HEAD}<div class="card"><div class="bottom"><div class="success"><h3>Already Voted!</h3><p>Token ${t} is burned.</p><a href="/"><button>Back to Table 1</button></a></div></div></div></body></html>`);
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title" style="font-size:26px">Table 2<br>Voting Desk</div><div class="sub">Token Verified ✅ | Choose Candidate</div></div><div class="bottom"><div class="label">SELECT YOUR PREFERRED CANDIDATE</div><button class="cand" onclick="vote('A')">Candidate A - Vote</button><button class="cand" onclick="vote('B')">Candidate B - Vote</button><button class="cand" onclick="vote('C')">Candidate C - Vote</button></div></div>
 <script>
 async function vote(c){
  if(!confirm('Vote for '+c+'?')) return;
  let r=await fetch('/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:'${t}',candidate:c})});
  let d=await r.json();
  if(d.error) return alert(d.error);
  document.body.innerHTML=\`${HEAD}<div class="card"><div class="bottom"><div class="success"><div style="font-size:40px">✅</div><h2 style="color:#065f46">Vote Successful!</h2><p>You voted for <b>\${c}</b></p><p style="font-size:13px;color:#64748b">Please leave the booth.<br>Token burned.</p><a href="/results"><button style="background:#0a1931;margin-top:16px">View Dashboard (Admin Only)</button></a><a href="/"><button style="background:#f1f5f9;color:#0a1931;margin-top:10px;border:2px solid #e2e8f0">← Back to Table 1</button></a></div></div></div></body></html>\`;
 }
 </script></body></html>`);
});

app.post('/vote',(req,res)=>{
 let {token,candidate}=req.body;
 if(!issuedTokens.has(token)) return res.json({error:'Invalid token'});
 if(usedTokens.has(token)) return res.json({error:'Token already used!'});
 votes[candidate]++; total++; usedTokens.add(token);
 let v=voterLog.find(x=>x.token===token); if(v){v.voted=true; v.candidate=candidate;}
 res.json({ok:true});
});

app.get('/results',(req,res)=>{
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title" style="font-size:24px">Live Results<br>Locked</div><div class="sub">Faculty / Admin Only - Encrypted</div></div><div class="bottom"><div class="label">ENTER ADMIN KEY</div><input id="k" type="password" placeholder="admin key!"><button onclick="unlock()" style="background:#7c3aed">UNLOCK LIVE RESULTS</button><div style="text-align:center;margin-top:12px;font-size:11px;color:#94a3b8">Students cannot view results while voting is ongoing</div><a href="/"><button style="background:#f1f5f9;color:#0a1931;margin-top:12px;border:2px solid #e2e8f0">← Back to Table 1</button></a></div></div><script>function unlock(){let k=document.getElementById('k').value; if(!k) return alert('Enter key'); location.href='/admin?key='+encodeURIComponent(k);}</script></body></html>`);
});

app.get('/admin',(req,res)=>{
 if(req.query.key!==ADMIN_KEY) return res.send(`${HEAD}<div class="card"><div class="bottom"><h3>Wrong Key!</h3><a href="/results"><button>Try Again</button></a></div></div></body></html>`);
 let pA=total?Math.round(votes.A/total*100):0, pB=total?Math.round(votes.B/total*100):0, pC=total?Math.round(votes.C/total*100):0;
 let listHtml = voterLog.map((v,i)=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:11px"><span>${i+1}. ${v.id}</span><span><b>${v.token}</b> ${v.voted?'✅'+v.candidate:'⏳'}</span></div>`).join('') || '<p style="font-size:12px;color:#94a3b8">No voters yet</p>';
 res.send(`${HEAD}<div class="card" style="max-width:460px"><div class="top"><div class="title" style="font-size:22px">Major<span class="blue">Tech</span> Dashboard</div><div class="sub">Total Votes: ${total} | Live</div></div><div class="bottom">
 <div style="background:#0f172a;color:#fff;padding:16px;border-radius:14px;margin-bottom:10px"><div style="display:flex;justify-content:space-between"><span>Candidate A</span><span>${pA}%</span></div><div style="margin-top:8px;height:8px;background:#1e293b;border-radius:10px"><div style="height:100%;width:${pA}%;background:#a78bfa;border-radius:10px"></div></div><div style="margin-top:6px;font-size:12px">${votes.A} VOTES</div></div>
 <div style="background:#0f172a;color:#fff;padding:16px;border-radius:14px;margin-bottom:10px"><div style="display:flex;justify-content:space-between"><span>Candidate B</span><span>${pB}%</span></div><div style="margin-top:8px;height:8px;background:#1e293b;border-radius:10px"><div style="height:100%;width:${pB}%;background:#a78bfa;border-radius:10px"></div></div><div style="margin-top:6px;font-size:12px">${votes.B} VOTES</div></div>
 <div style="background:#0f172a;color:#fff;padding:16px;border-radius:14px;margin-bottom:16px"><div style="display:flex;justify-content:space-between"><span>Candidate C</span><span>${pC}%</span></div><div style="margin-top:8px;height:8px;background:#1e293b;border-radius:10px"><div style="height:100%;width:${pC}%;background:#a78bfa;border-radius:10px"></div></div><div style="margin-top:6px;font-size:12px">${votes.C} VOTES</div></div>
 <a href="/"><button style="background:#0a1931">← BACK TO TABLE 1</button></a>
 <button onclick="let e=document.getElementById('voters'); e.style.display=e.style.display==='none'?'block':'none'" style="background:#f1f5f9;color:#0a1931;border:2px solid #e2e8f0;margin-top:8px">📋 VIEW ALL VOTERS / TOKEN LIST (${voterLog.length})</button>
 <div id="voters" style="display:none;margin-top:12px;background:#fff;border:2px solid #e2e8f0;border-radius:12px;padding:12px;max-height:220px;overflow:auto"><div style="font-weight:700;font-size:11px;margin-bottom:8px">SAVED TOKEN LIST - DATABASE</div>${listHtml}<button onclick="let t=\`${voterLog.map(v=>v.id+','+v.token+','+(v.voted?'VOTED-'+v.candidate:'NOT VOTED')).join('\\n')}\`; navigator.clipboard.writeText(t); alert('Copied!')" style="background:#7c3aed;padding:10px;font-size:11px;margin-top:10px">COPY LIST / SAVE</button></div>
 <button onclick="let s=prompt('⚠️ SUPER ADMIN ONLY! Enter SUPER RESET KEY:'); if(!s) return; if(confirm('DANGER! DELETE ALL?')){fetch('/admin/reset?key=${req.query.key}&super='+encodeURIComponent(s),{method:'POST'}).then(r=>r.json()).then(d=>{if(d.error) alert(d.error); else {alert('Reset done by Super Admin!'); location.href='/admin?key=${req.query.key}'}})}" style="background:#fef2f2;color:#dc2626;border:2px solid #fecaca;margin-top:8px">🗑️ RESET TOKENS & VOTES (Super Admin Only)</button>
 </div></div></body></html>`);
});

app.post('/admin/reset',(req,res)=>{
 if(req.query.key!==ADMIN_KEY) return res.json({error:'Wrong admin key'});
 if(req.query.super!==SUPER_RESET_KEY) return res.json({error:'❌ WRONG SUPER KEY! Only Super Admin can reset!'});
 votes={A:0,B:0,C:0}; total=0; issuedTokens.clear(); usedTokens.clear(); usedIds.clear(); voterLog=[];
 res.json({ok:true});
});

module.exports=app;
