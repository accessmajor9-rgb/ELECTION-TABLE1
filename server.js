const express = require('express');
const app = express();
app.use(express.json());

let votes = { A: 0, B: 0, C: 0 };
let total = 0;
let issuedTokens = new Set();
let usedTokens = new Set();
let usedIds = new Set();
const ADMIN_KEY = "Major2025!";

// ONLY FIX FOR PHONE SCREEN - THIS WAS THE ONLY THING WE NEEDED
const HEAD = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"><style>
*{box-sizing:border-box}html,body{height:100%}body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:16px}
.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3)}
.top{background:#0a1931;padding:26px 24px}.pill{display:inline-block;border:1px solid rgba(255,255,255,.2);color:#cbd5e1;font-size:10px;padding:6px 12px;border-radius:20px}
.title{color:#fff;font-size:34px;font-weight:800;line-height:1.1;margin:18px 0 6px}.blue{color:#5fa8ff}.sub{color:#8aa0c6;font-size:13px}
.bottom{padding:28px 22px}.label{color:#5b6b86;font-size:11px;font-weight:700;letter-spacing:1.2px;margin-bottom:10px}
input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px;font-size:16px;outline:none}
button{width:100%;margin-top:16px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:800;cursor:pointer}
.tokenBox{margin-top:20px;background:#f1f5f9;padding:18px;border-radius:16px;text-align:center;display:none}
.tokenNum{font-size:36px;font-weight:900;letter-spacing:5px;color:#0a1931}
.foot{display:flex;justify-content:space-between;padding:12px 20px;background:#f8fafc;color:#94a3b8;font-size:10px}
</style></head><body>`;

app.get('/', (req,res)=>{
 res.send(`${HEAD}<div class="card"><div class="top"><div class="pill">TABLE 1 | VERIFICATION DESK | MAJORTECH OS</div><div class="title">Major<span class="blue">Tech</span> Verify</div><div class="sub">Liberia Institute | Official Student ID<br>Verification and Token Engine</div></div><div class="bottom"><div class="label">ENTER STUDENT ID NUMBER</div><input id="sid" placeholder="LISE-032-2025"><button onclick="verify()">VERIFY ></button><div id="result" class="tokenBox"><div style="font-size:11px;color:#64748b">VERIFIED - YOUR 6-DIGIT TOKEN</div><div id="tok" class="tokenNum"></div><div id="idshow" style="font-size:11px;color:#64748b;margin-top:8px"></div><div style="margin-top:12px;font-size:11px;color:#94a3b8">Use this token in TABLE 2 to vote</div></div></div><div class="foot"><span>SECURE | ENCRYPTED</span><span>POWERED BY MAJORTECH</span></div></div>
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
 }
 </script></body></html>`);
});

app.post('/verify',(req,res)=>{
 let {studentId}=req.body;
 if(!studentId) return res.json({error:'Enter ID'});
 if(usedIds.has(studentId)) return res.json({error:'This ID already verified!'});
 let token=Math.floor(100000+Math.random()*900000).toString();
 issuedTokens.add(token); usedIds.add(studentId);
 res.json({token});
});

app.get('/table2',(req,res)=>{
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title" style="font-size:26px">Table 2<br>Voting Desk</div><div class="sub">Enter 6-digit token from Table 1</div></div><div class="bottom"><div class="label">ENTER YOUR TOKEN</div><input id="t" placeholder="e.g. 559342"><button onclick="go()">VERIFY TOKEN ></button></div></div><script>function go(){let t=document.getElementById('t').value.trim(); if(!t) return alert('Enter token'); location.href='/ballot?token='+t;}</script></body></html>`);
});

app.get('/ballot',(req,res)=>{
 let t=(req.query.token||'').trim();
 if(!issuedTokens.has(t)) return res.send(`${HEAD}<div class="card"><div class="bottom"><h3>Invalid Token</h3><p>Go to Table 1 to get token</p><a href="/"><button>Go to Table 1</button></a></div></div></body></html>`);
 if(usedTokens.has(t)) return res.send(`${HEAD}<div class="card"><div class="bottom"><h3>Token Already Used - You Voted!</h3><a href="/results"><button>View Results Status</button></a></div></div></body></html>`);
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title" style="font-size:22px">Ballot Paper</div><div class="sub">Token: ${t} | One Vote Only</div></div><div class="bottom"><button onclick="vote('A')" style="background:#6d28d9">Candidate A</button><button onclick="vote('B')" style="background:#6d28d9">Candidate B</button><button onclick="vote('C')" style="background:#6d28d9">Candidate C</button></div></div><script>async function vote(c){let r=await fetch('/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:'${t}',candidate:c})});let d=await r.json();if(d.error)alert(d.error);else{alert('Vote counted for '+c);location.href='/results';}}</script></body></html>`);
});

app.post('/vote',(req,res)=>{
 let {token,candidate}=req.body;
 if(!issuedTokens.has(token)) return res.json({error:'Invalid token'});
 if(usedTokens.has(token)) return res.json({error:'Already voted'});
 votes[candidate]++; total++; usedTokens.add(token);
 res.json({ok:true});
});

app.get('/results',(req,res)=>{
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title" style="font-size:24px">Results<br>Locked</div><div class="sub">Admin Only - Enter Key</div></div><div class="bottom"><input id="k" type="password" placeholder="Enter Admin Key"><button onclick="unlock()" style="background:#7c3aed">UNLOCK LIVE RESULTS</button><div style="text-align:center;margin-top:12px;font-size:11px;color:#94a3b8">Students cannot view results</div></div></div><script>function unlock(){let k=document.getElementById('k').value; if(!k)return alert('Enter key'); location.href='/admin?key='+k;}</script></body></html>`);
});

app.get('/admin',(req,res)=>{
 if(req.query.key!==ADMIN_KEY) return res.send(`${HEAD}<div class="card"><div class="bottom"><h3>Wrong Admin Key!</h3><a href="/results"><button>Try Again</button></a></div></div></body></html>`);
 let pA=total?Math.round(votes.A/total*100):0, pB=total?Math.round(votes.B/total*100):0, pC=total?Math.round(votes.C/total*100):0;
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title" style="font-size:22px">Live Results<br>${total} Votes</div><div class="sub">ADMIN MODE</div></div><div class="bottom"><div style="background:#0f172a;color:#fff;padding:14px;border-radius:14px;margin-bottom:10px">A - ${votes.A} votes - ${pA}%</div><div style="background:#0f172a;color:#fff;padding:14px;border-radius:14px;margin-bottom:10px">B - ${votes.B} votes - ${pB}%</div><div style="background:#0f172a;color:#fff;padding:14px;border-radius:14px">C - ${votes.C} votes - ${pC}%</div></div></div></body></html>`);
});

module.exports=app;
