const express = require('express');
const app = express();
app.use(express.json());

let votes = { A: 0, B: 0, C: 0 };
let total = 0;
let issuedTokens = new Set();
let usedTokens = new Set();
let usedIds = new Set();
const ADMIN_KEY = "Major2025!";

const HEAD = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>
*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:16px}
.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3)}
.top{background:#0a1931;padding:26px 24px}.pill{display:inline-block;border:1px solid rgba(255,255,255,.2);color:#cbd5e1;font-size:10px;padding:6px 12px;border-radius:20px}
.title{color:#fff;font-size:32px;font-weight:800;line-height:1.1;margin:16px 0 6px}.blue{color:#5fa8ff}.sub{color:#8aa0c6;font-size:13px}
.bottom{padding:26px 22px}.label{color:#5b6b86;font-size:11px;font-weight:700;letter-spacing:1.2px;margin-bottom:10px}
input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px;font-size:16px;outline:none}
button{width:100%;margin-top:14px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:800;cursor:pointer;font-size:15px}
.cand{width:100%;padding:16px;margin-top:12px;background:#6d28d9;color:#fff;border:none;border-radius:14px;font-weight:700}
.tokenBox{margin-top:18px;background:#f1f5f9;padding:18px;border-radius:16px;text-align:center;display:none}
.tokenNum{font-size:36px;font-weight:900;letter-spacing:5px;color:#0a1931}
.foot{display:flex;justify-content:space-between;padding:12px 20px;background:#f8fafc;color:#94a3b8;font-size:10px}
.success{background:#ecfdf5;border:2px solid #10b981;padding:20px;border-radius:16px;text-align:center}
</style></head><body>`;

// TABLE 1 - VERIFY
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
 if(usedIds.has(studentId)) return res.json({error:'This ID already used! One ID one token.'});
 let token=Math.floor(100000+Math.random()*900000).toString();
 issuedTokens.add(token); usedIds.add(studentId);
 res.json({token});
});

// TABLE 2 - TOKEN ALREADY PASTED + CANDIDATES
app.get('/table2',(req,res)=>{
 let t=(req.query.token||'').trim();
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title" style="font-size:26px">Table 2<br>Voting Desk</div><div class="sub">Your token is already pasted - Just click NEXT</div></div><div class="bottom"><div class="label">YOUR TOKEN (AUTO-FILLED)</div><input id="tok" value="${t}" readonly style="background:#f1f5f9;font-weight:700;letter-spacing:2px;text-align:center"><button onclick="showCandidates()" style="background:#7c3aed">NEXT → SHOW CANDIDATES</button><div id="candidates" style="display:none;margin-top:20px;border-top:2px solid #f1f5f9;padding-top:20px"><div class="label">SELECT YOUR PREFERRED CANDIDATE</div><button class="cand" onclick="vote('A')">Candidate A - Vote</button><button class="cand" onclick="vote('B')">Candidate B - Vote</button><button class="cand" onclick="vote('C')">Candidate C - Vote</button></div></div><div class="foot"><span>1 TOKEN = 1 VOTE</span><span>SECURE</span></div></div>
 <script>
 function showCandidates(){
  let token=document.getElementById('tok').value.trim();
  if(!token) return alert('No token found! Go back to Table 1');
  document.getElementById('candidates').style.display='block';
  window.scrollTo(0, document.body.scrollHeight);
 }
 async function vote(c){
  let token=document.getElementById('tok').value.trim();
  let r=await fetch('/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:token,candidate:c})});
  let d=await r.json();
  if(d.error) return alert(d.error);
  document.body.innerHTML=\`${HEAD}<div class="card"><div class="bottom"><div class="success"><div style="font-size:40px">✅</div><h2 style="color:#065f46">Vote Successful!</h2><p>You have voted for <b>\${c}</b></p><p style="font-size:13px;color:#64748b">Please leave the booth.<br>1 vote per person.<br>Your token <b>\${token}</b> is now BURNED.</p><a href="/results"><button style="background:#0a1931;margin-top:20px">View Dashboard (Admin Only)</button></a><a href="/"><button style="background:#f1f5f9;color:#0a1931;margin-top:10px">Back to Table 1</button></a></div></div></div></body></html>\`;
 }
 </script></body></html>`);
});

app.post('/vote',(req,res)=>{
 let {token,candidate}=req.body;
 if(!issuedTokens.has(token)) return res.json({error:'Invalid token! Go to Table 1'});
 if(usedTokens.has(token)) return res.json({error:'This token already used! Token burned.'});
 votes[candidate]++; total++; usedTokens.add(token);
 res.json({ok:true});
});

// RESULTS - PASSWORD PROTECTED
app.get('/results',(req,res)=>{
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title" style="font-size:24px">Live Results<br>Locked</div><div class="sub">Faculty / Admin Only - Encrypted</div></div><div class="bottom"><div class="label">ENTER ADMIN KEY</div><input id="k" type="password" placeholder="Major2025!"><button onclick="unlock()" style="background:#7c3aed">UNLOCK LIVE RESULTS</button><div style="text-align:center;margin-top:12px;font-size:11px;color:#94a3b8">Students cannot view results while voting is ongoing</div></div></div><script>function unlock(){let k=document.getElementById('k').value; if(!k) return alert('Enter key'); location.href='/admin?key='+k;}</script></body></html>`);
});

app.get('/admin',(req,res)=>{
 if(req.query.key!==ADMIN_KEY) return res.send(`${HEAD}<div class="card"><div class="bottom"><h3>Wrong Key!</h3><p>Access Denied</p><a href="/results"><button>Try Again</button></a></div></div></body></html>`);
 let pA=total?Math.round(votes.A/total*100):0, pB=total?Math.round(votes.B/total*100):0, pC=total?Math.round(votes.C/total*100):0;
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title" style="font-size:22px">Major<span class="blue">Tech</span> Dashboard</div><div class="sub">Total Votes: ${total} | Live</div></div><div class="bottom"><div style="background:#0f172a;color:#fff;padding:16px;border-radius:14px;margin-bottom:12px"><div style="display:flex;justify-content:space-between"><span>Candidate A</span><span>${pA}%</span></div><div style="margin-top:8px;height:8px;background:#1e293b;border-radius:10px"><div style="height:100%;width:${pA}%;background:#a78bfa;border-radius:10px"></div></div><div style="margin-top:6px;font-size:12px">${votes.A} VOTES</div></div><div style="background:#0f172a;color:#fff;padding:16px;border-radius:14px;margin-bottom:12px"><div style="display:flex;justify-content:space-between"><span>Candidate B</span><span>${pB}%</span></div><div style="margin-top:8px;height:8px;background:#1e293b;border-radius:10px"><div style="height:100%;width:${pB}%;background:#a78bfa;border-radius:10px"></div></div><div style="margin-top:6px;font-size:12px">${votes.B} VOTES</div></div><div style="background:#0f172a;color:#fff;padding:16px;border-radius:14px"><div style="display:flex;justify-content:space-between"><span>Candidate C</span><span>${pC}%</span></div><div style="margin-top:8px;height:8px;background:#1e293b;border-radius:10px"><div style="height:100%;width:${pC}%;background:#a78bfa;border-radius:10px"></div></div><div style="margin-top:6px;font-size:12px">${votes.C} VOTES</div></div></div></div></body></html>`);
});

module.exports=app;
