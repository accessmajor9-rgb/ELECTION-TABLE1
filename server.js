const express = require('express');
const app = express();
app.use(express.json());

let votes = { A: 0, B: 0, C: 0 };
let total = 0;
let usedTokens = new Set();
let usedIds = new Set();
const ADMIN_KEY = "Major2025!";

const STYLE = `<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>
*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3)}
.top{background:#0a1931;padding:26px 24px}.pill{display:inline-block;border:1px solid rgba(255,255,255,.25);color:#cbd5e1;font-size:11px;padding:6px 12px;border-radius:20px}
.title{margin:18px 0 6px;color:#fff;font-size:34px;font-weight:800;line-height:1.1}.blue{color:#5fa8ff}.sub{color:#8aa0c6;font-size:14px}
.bottom{padding:28px 22px}.label{color:#5b6b86;font-size:12px;letter-spacing:1.5px;font-weight:700;margin-bottom:10px}
input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px;font-size:16px;outline:none}
button{width:100%;margin-top:16px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:700;font-size:15px;cursor:pointer}
.foot{display:flex;justify-content:space-between;padding:14px 22px;background:#f8fafc;color:#94a3b8;font-size:11px}
.cand{width:100%;padding:16px;margin-top:12px;background:#6d28d9;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer}
.bar{height:8px;background:#1e293b;border-radius:10px;margin:8px 0;overflow:hidden}.fill{height:100%;background:#a78bfa}
</style>`;

app.get('/', (req,res)=>{
 res.send(`<!DOCTYPE html><html><head>${STYLE}</head><body><div class="card"><div class="top"><div class="pill">TABLE 1 | VERIFICATION DESK</div><div class="title">Major<span class="blue">Tech</span><br>Verify</div><div class="sub">Liberia Institute | Token Engine</div></div><div class="bottom"><div class="label">ENTER STUDENT ID</div><input id="sid" placeholder="e.g. LISE-037-2025"><button onclick="verify()">VERIFY ></button></div><div class="foot"><span>SECURE</span><span>MAJORTECH</span></div></div>
 <script>
 async function verify(){
  let id=document.getElementById('sid').value.trim();
  if(!id) return alert('Enter ID');
  let r=await fetch('/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentId:id})});
  let d=await r.json();
  if(d.error) alert(d.error); else location.href='/table2?token='+d.token;
 }
 </script></body></html>`);
});

app.post('/verify',(req,res)=>{
 let {studentId}=req.body;
 if(!studentId) return res.json({error:'ID required'});
 if(usedIds.has(studentId)) return res.json({error:'This ID already used!'});
 let token=Math.floor(100000+Math.random()*900000).toString();
 usedIds.add(studentId);
 res.json({token});
});

app.get('/table2',(req,res)=>{
 let token=req.query.token||'';
 res.send(`<!DOCTYPE html><html><head>${STYLE}</head><body><div class="card"><div class="top"><div class="title" style="font-size:26px">Major<span class="blue">Tech</span> Vote</div><div class="sub">Enter 6-digit token</div></div><div class="bottom"><input id="tok" value="${token}" placeholder="e.g. 203332"><button onclick="go()">ENTER ></button><p style="font-size:10px;color:#94a3b8;margin-top:12px">Only Token Required - One Vote Per Student</p></div></div>
 <script>function go(){let t=document.getElementById('tok').value.trim(); if(!t) return alert('Enter token'); location.href='/ballot?token='+t;}</script></body></html>`);
});

app.get('/ballot',(req,res)=>{
 let token=req.query.token||'';
 if(usedTokens.has(token)) return res.send(`<!DOCTYPE html><html><head>${STYLE}</head><body><div class="card"><div class="bottom"><h3>Token Already Used!</h3><p>This token has voted.</p><a href="/results"><button>View Results</button></a></div></div></body></html>`);
 res.send(`<!DOCTYPE html><html><head>${STYLE}</head><body><div class="card"><div class="top"><div style="color:#cbd5e1;font-size:12px">Ballot Paper - Token: ${token}</div><div class="title" style="font-size:20px">Select Candidate</div></div><div class="bottom"><button class="cand" onclick="vote('A')">Candidate A</button><button class="cand" onclick="vote('B')">Candidate B</button><button class="cand" onclick="vote('C')">Candidate C</button></div></div>
 <script>
 async function vote(c){
  let r=await fetch('/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:'${token}',candidate:c})});
  let d=await r.json();
  if(d.error) alert(d.error); else { alert('Voted for '+c+'!'); location.href='/results'; }
 }
 </script></body></html>`);
});

app.post('/vote',(req,res)=>{
 let {token,candidate}=req.body;
 if(!token||!candidate) return res.json({error:'Missing data'});
 if(usedTokens.has(token)) return res.json({error:'Token already used'});
 if(!votes.hasOwnProperty(candidate)) return res.json({error:'Invalid candidate'});
 votes[candidate]++; total++; usedTokens.add(token);
 res.json({ok:true});
});

app.get('/results',(req,res)=>{
 let key=req.query.key||'';
 let isAdmin=key===ADMIN_KEY;
 let pA=total?Math.round(votes.A/total*100):0;
 let pB=total?Math.round(votes.B/total*100):0;
 let pC=total?Math.round(votes.C/total*100):0;
 res.send(`<!DOCTYPE html><html><head>${STYLE}</head><body><div class="card"><div class="top"><div class="title" style="font-size:24px">Major<span class="blue">Tech</span><br>Live Results</div><div class="sub" style="font-size:10px">${isAdmin?'ADMIN MODE - Key: Major2025!':'Public Results'}</div></div><div class="bottom">
 <div style="background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;padding:14px;border-radius:14px;display:flex;justify-content:space-between;margin-bottom:16px"><div><div style="font-size:10px;opacity:.8">TOTAL VOTES CAST</div><div style="font-size:32px;font-weight:800">${total}</div></div><div style="font-size:10px;align-self:center">IN PROGRESS</div></div>
 <div style="background:#0f172a;color:#fff;padding:14px;border-radius:14px;margin-bottom:12px"><div style="font-size:12px">Candidate A ${pA}%</div><div class="bar"><div class="fill" style="width:${pA}%"></div></div><div style="font-size:11px">${votes.A} VOTES</div></div>
 <div style="background:#0f172a;color:#fff;padding:14px;border-radius:14px;margin-bottom:12px"><div style="font-size:12px">Candidate B ${pB}%</div><div class="bar"><div class="fill" style="width:${pB}%"></div></div><div style="font-size:11px">${votes.B} VOTES</div></div>
 <div style="background:#0f172a;color:#fff;padding:14px;border-radius:14px;margin-bottom:12px"><div style="font-size:12px">Candidate C ${pC}%</div><div class="bar"><div class="fill" style="width:${pC}%"></div></div><div style="font-size:11px">${votes.C} VOTES</div></div>
 <a href="/results?key=Major2025!" style="font-size:11px;color:#6d28d9;text-align:center;display:block">Admin Dashboard</a>
 </div></div></body></html>`);
});

module.exports=app;
