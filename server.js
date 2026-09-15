const express = require('express');
const app = express();
app.use(express.json());

let verified = {};
let tokens = {};
let votes = { A: 0, B: 0, C: 0 };
let total = 0;
let usedTokens = new Set();

// TABLE 1 - VERIFICATION
app.get('/', (req, res) => {
  res.send(`
<style>
*{box-sizing:border-box}body{margin:0;font-family:Arial;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}
.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3)}
.top{background:#0a1931;padding:26px 24px}.pill{display:inline-block;border:1px solid rgba(255,255,255,.25);color:#cbd5e1;font-size:11px;padding:8px 14px;border-radius:20px;background:rgba(255,255,255,.08)}
.title{margin:18px 0 6px;color:#fff;font-size:34px;font-weight:800}.blue{color:#5fa8ff}.sub{color:#8aa0c6;font-size:14px;line-height:1.3}
.bottom{padding:28px 22px}.label{color:#5b6b86;font-size:12px;letter-spacing:1.5px;font-weight:700;margin-bottom:10px}
input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px;font-size:16px;outline:none}
button{width:100%;margin-top:16px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:800;cursor:pointer}
.foot{display:flex;justify-content:space-between;padding:14px 22px;background:#f8fafc;color:#9aa9c0;font-size:10px;letter-spacing:1px}
</style>
<div class="card">
<div class="top">
<div class="pill">TABLE 1 | VERIFICATION DESK | MAJORTECH OS</div>
<div class="title">Major<span class="blue">Tech</span> Verify</div>
<div class="sub">Liberia Institute | Official Student ID<br>Verification and Token Engine</div>
</div>
<div class="bottom">
<div class="label">ENTER STUDENT ID NUMBER</div>
<input id="sid" placeholder="e.g. LISE-037-2025">
<button onclick="doVerify()">VERIFY ></button>
<div id="out" style="display:none;margin-top:18px;padding:16px;background:#f0f5ff;border-radius:16px">
<div style="font-size:12px;color:#5b6b86">YOUR 6-DIGIT TOKEN</div>
<div id="tok" style="font-size:32px;font-weight:900;letter-spacing:4px"></div>
<div id="msg" style="font-size:13px;margin-top:6px"></div>
<button onclick="go2()" style="background:#00c853;margin-top:12px">Go to TABLE 2 -></button>
</div>
</div>
<div class="foot"><span>SECURE | ENCRYPTED</span><span>POWERED BY MAJORTECH</span></div>
</div>
<script>
let lastTok="";
async function doVerify(){
let id=document.getElementById("sid").value.trim();
if(!id){alert("Enter ID");return}
let r=await fetch("/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sid:id})});
let d=await r.json();
if(d.ok){lastTok=d.token;let o=document.getElementById("out");o.style.display="block";document.getElementById("tok").innerText=d.token;document.getElementById("msg").innerText="ID: "+id;}
}
function go2(){if(lastTok){location.href="/table2?token="+lastTok}else{location.href="/table2"}}
</script>
`);
});

app.post('/verify', (req, res) => {
  let sid = req.body.sid;
  if (!sid) return res.json({ ok: false, msg: 'ID required' });
  sid = sid.trim().toUpperCase();
  if (sid.length < 5) return res.json({ ok: false, msg: 'Invalid' });
  if (verified[sid]) return res.json({ ok: true, token: verified[sid] });
  let tok = Math.floor(100000 + Math.random() * 900000).toString();
  verified[sid] = tok;
  tokens[tok] = sid;
  res.json({ ok: true, token: tok });
});

// TABLE 2 - ONLY TOKEN INPUT
app.get('/table2', (req, res) => {
  let pre = req.query.token || '';
  res.send(`
<style>body{margin:0;font-family:Arial;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden}.top{background:#0a1931;padding:26px 24px}.title{color:#fff;font-size:32px;font-weight:800}.blue{color:#5fa8ff}.sub{color:#8aa0c6}.bottom{padding:28px 22px}input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px}button{width:100%;margin-top:16px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:800}</style>
<div class="card"><div class="top"><div style="color:#cbd5e1;font-size:11px">TABLE 2 | VOTING BOOTH</div><div class="title">Major<span class="blue">Tech</span> Vote</div><div class="sub">Enter your 6-digit token to vote</div></div><div class="bottom">
<div style="font-size:12px;font-weight:700;margin-bottom:8px">ENTER 6-DIGIT TOKEN</div>
<input id="token" value="${pre}" maxlength="6" placeholder="e.g. 847392">
<button onclick="checkToken()">ENTER ></button>
<div id="err" style="color:red;margin-top:12px;font-weight:bold"></div>
<p><a href="/">Back to TABLE 1</a> | <a href="/results">Results</a></p>
</div></div>
<script>
async function checkToken(){
let t=document.getElementById("token").value.trim();
if(t.length!==6){document.getElementById("err").innerText="Enter 6 digits";return}
let r=await fetch("/check-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:t})});
let d=await r.json();
if(d.ok){location.href="/ballot?token="+t}else{document.getElementById("err").innerText=d.message}
}
</script>
`);
});

app.post('/check-token', (req, res) => {
  let t = req.body.token;
  if (!t) return res.json({ ok: false, message: 'Token required' });
  if (!(t in tokens)) return res.json({ ok: false, message: 'Invalid token - Go to TABLE 1' });
  if (usedTokens.has(t)) return res.json({ ok: false, message: 'Token already used - One vote only' });
  res.json({ ok: true });
});

// BALLOT - LIST OF CANDIDATES
app.get('/ballot', (req, res) => {
  let t = req.query.token || '';
  res.send(`
<style>body{margin:0;font-family:Arial;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden}.top{background:#0a1931;padding:26px 24px;color:#fff}.bottom{padding:22px}button{width:100%;padding:16px;margin:8px 0;background:#5e00ff;color:#fff;border:none;border-radius:14px;font-weight:800;font-size:16px;cursor:pointer}</style>
<div class="card"><div class="top"><div style="font-size:11px;opacity:.7">TABLE 2 | BALLOT PAPER | MAJORTECH OS</div><div style="font-size:26px;font-weight:800">Select Candidate</div><div style="color:#8aa0c6">Token: ${t}</div></div>
<div class="bottom">
<button onclick="doVote(1)">Candidate A</button>
<button onclick="doVote(2)">Candidate B</button>
<button onclick="doVote(3)">Candidate C</button>
<div id="out" style="text-align:center;margin-top:12px;font-weight:bold"></div>
</div></div>
<script>
let tok="${t}";
async function doVote(n){
let m={1:"A",2:"B",3:"C"};let c=m[n];
let r=await fetch("/vote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:tok,c:c})});
let d=await r.json();
document.getElementById("out").innerText=d.message;
if(d.ok){setTimeout(()=>{location.href="/success?c="+c},800)}
}
</script>
`);
});

app.post('/vote', (req, res) => {
  let t = req.body.token;
  let c = req.body.c;
  if (!t ||!c) return res.json({ message: 'Missing', ok: false });
  if (!(t in tokens)) return res.json({ message: 'Invalid token', ok: false });
  if (usedTokens.has(t)) return res.json({ message: 'Token already used', ok: false });
  if (!(c in votes)) return res.json({ message: 'Invalid candidate', ok: false });
  votes[c]++; total++; usedTokens.add(t);
  res.json({ message: 'Voted for ' + c, ok: true });
});

// LIVE RESULTS - EXACT YOUR SCREENSHOT
app.get('/results', (req, res) => {
  res.send(`
<style>
*{box-sizing:border-box}body{margin:0;font-family:Arial;background:linear-gradient(135deg,#8a7cff,#6a4bff,#4a2ac7);min-height:100vh;padding:18px}
.header{max-width:420px;margin:0 auto 16px}.h1{color:#fff;font-size:36px;font-weight:900;line-height:1.1}.blue{color:#6dc2ff}
.card-purple{background:linear-gradient(90deg,#4a1fb5,#7a3bff);border-radius:26px;padding:20px 22px;color:#fff;display:flex;justify-content:space-between;align-items:center;max-width:420px;margin:0 auto 16px}
.big{font-size:56px;font-weight:900;line-height:1}.small{font-size:11px;letter-spacing:1px;opacity:.9}
.card-dark{background:#0f1e33;border-radius:26px;padding:18px;max-width:420px;margin:0 auto 14px;color:#fff}
.row{display:flex;justify-content:space-between;align-items:center}.icon{width:54px;height:54px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px}
.bar{height:10px;background:#1e2e4a;border-radius:10px;margin:14px 0 8px;overflow:hidden}.fill{height:100%;border-radius:10px;transition:width.5s}.votes{font-size:11px;color:#7a8aa6;letter-spacing:1px}.pct{font-size:32px;font-weight:900}
</style>
<div class="header"><div class="h1">Major<span class="blue">Tech</span><br>Live Results</div></div>
<div class="card-purple"><div><div class="small">TOTAL VOTES CAST</div><div class="big" id="total">0</div></div><div class="small">ELECTION IN PROGRESS</div></div>
<div class="card-dark"><div class="row"><div style="display:flex;align-items:center;gap:12px"><div class="icon" style="background:#2ec4ff">A</div><div style="font-weight:800">Candidate A</div></div><div class="pct" id="pA">0%</div></div><div class="bar"><div class="fill" id="fA" style="width:0%;background:#2ec4ff"></div></div><div class="votes" id="vA">0 VOTES</div></div>
<div class="card-dark"><div class="row"><div style="display:flex;align-items:center;gap:12px"><div class="icon" style="background:#a98bff">B</div><div style="font-weight:800">Candidate B</div></div><div class="pct" id="pB">0%</div></div><div class="bar"><div class="fill" id="fB" style="width:0%;background:#a98bff"></div></div><div class="votes" id="vB">0 VOTES</div></div>
<div class="card-dark"><div class="row"><div style="display:flex;align-items:center;gap:12px"><div class="icon" style="background:#ff7a8a">C</div><div style="font-weight:800">Candidate C</div></div><div class="pct" id="pC">0%</div></div><div class="bar"><div class="fill" id="fC" style="width:0%;background:#ff7a8a"></div></div><div class="votes" id="vC">0 VOTES</div></div>
<div style="max-width:420px;margin:16px auto;text-align:center"><a href="/" style="color:#fff">TABLE 1</a> | <a href="/table2" style="color:#fff">TABLE 2</a> | <a href="/admin/dashboard" style="color:#fff">Admin</a></div>
<script>
function load(){
fetch("/api/results").then(r=>r.json()).then(d=>{
let tot=d.total;document.getElementById("total").innerText=tot;
let pa=0,pb=0,pc=0;
if(tot>0){pa=Math.round(d.votes.A/tot*100);pb=Math.round(d.votes.B/tot*100);pc=Math.round(d.votes.C/tot*100);}
document.getElementById("pA").innerText=pa+"%";document.getElementById("pB").innerText=pb+"%";document.getElementById("pC").innerText=pc+"%";
document.getElementById("fA").style.width=pa+"%";document.getElementById("fB").style.width=pb+"%";document.getElementById("fC").style.width=pc+"%";
document.getElementById("vA").innerText=d.votes.A+" VOTES";document.getElementById("vB").innerText=d.votes.B+" VOTES";document.getElementById("vC").innerText=d.votes.C+" VOTES";
})
}
load();setInterval(load,2000);
</script>
`);
});

app.get('/success', (req, res) => {
  let c = req.query.c || 'A';
  res.send(`
<style>body{margin:0;font-family:Arial;background:linear-gradient(135deg,#8a7cff,#6a4bff);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:420px;background:#0f1e33;border-radius:28px;padding:28px;text-align:center;color:#fff}.check{width:80px;height:80px;background:#00e676;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 16px}</style>
<div class="card"><div class="check">✓</div><div style="font-size:26px;font-weight:900">Vote Successful!</div><div style="margin-top:10px;color:#a98bff">You voted for Candidate ${c}</div><div style="margin-top:18px;padding:14px;background:#1a2b4a;border-radius:14px">Thank you - Your vote is counted in Live Results</div><a href="/results" style="display:block;margin-top:20px;padding:14px;background:#7a3bff;color:#fff;border-radius:14px;text-decoration:none;font-weight:800">View Live Results</a></div>
`);
});

app.get('/api/results', (req, res) => { res.json({ votes, total, verified, used: usedTokens.size }); });
app.get('/admin/dashboard', (req, res) => {
  res.send(\`<h1>Dashboard</h1><div id="d">Loading</div><br><a href="/admin/reset">Reset All</a> | <a href="/">Home</a> | <a href="/results">Results</a><script>fetch("/api/results").then(r=>r.json()).then(d=>{let h="Total: "+d.total+"<br>";for(let k in d.votes){h+=k+": "+d.votes[k]+"<br>"}h+="<hr>";for(let k in d.verified){h+=k+" => "+d.verified[k]+"<br>"}document.getElementById("d").innerHTML=h})</script>\`);
});
app.get('/admin', (req, res) => res.redirect('/admin/dashboard'));
app.get('/admin/reset', (req, res) => { verified={};tokens={};votes={A:0,B:0,C:0};total=0;usedTokens.clear();res.redirect('/'); });

module.exports = app;
