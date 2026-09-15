const express = require('express');
const app = express();
app.use(express.json());

let verified = {};
let tokens = {};
let votes = { A: 0, B: 0, C: 0 };
let total = 0;
let usedTokens = new Set();
const ADMIN_KEY = "Major2025!"; // YOUR SECRET KEY

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
*{box-sizing:border-box}body{margin:0;font-family:Arial;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}
.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3)}
.top{background:#0a1931;padding:26px 24px}.pill{display:inline-block;border:1px solid rgba(255,255,255,.25);color:#cbd5e1;font-size:11px;padding:8px 14px;border-radius:20px;background:rgba(255,255,255,.08)}
.title{margin:18px 0 6px;color:#fff;font-size:34px;font-weight:800}.blue{color:#5fa8ff}.sub{color:#8aa0c6;font-size:14px}
.bottom{padding:28px 22px}.label{color:#5b6b86;font-size:12px;letter-spacing:1.5px;font-weight:700;margin-bottom:10px}
input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px;font-size:16px}
button{width:100%;margin-top:16px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:800;cursor:pointer}
.foot{display:flex;justify-content:space-between;padding:14px 22px;background:#f8fafc;color:#9aa9c0;font-size:10px}
</style>
<div class="card">
<div class="top"><div class="pill">TABLE 1 | VERIFICATION DESK</div><div class="title">Major<span class="blue">Tech</span> Verify</div><div class="sub">Liberia Institute | Token Engine</div></div>
<div class="bottom"><div class="label">ENTER STUDENT ID</div><input id="sid" placeholder="e.g. LISE-037-2025"><button onclick="doVerify()">VERIFY ></button>
<div id="out" style="display:none;margin-top:18px;padding:16px;background:#f0f5ff;border-radius:16px"><div id="tok" style="font-size:32px;font-weight:900"></div><button onclick="go2()" style="background:#00c853;margin-top:12px">Go to TABLE 2 -></button></div></div>
<div class="foot"><span>SECURE</span><span>MAJORTECH</span></div></div>
<script>
let lastTok="";async function doVerify(){let id=document.getElementById("sid").value.trim();if(!id){alert("Enter ID");return}let r=await fetch("/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sid:id})});let d=await r.json();if(d.ok){lastTok=d.token;document.getElementById("out").style.display="block";document.getElementById("tok").innerText=d.token;}}function go2(){if(lastTok){location.href="/table2?token="+lastTok}else{location.href="/table2"}}
</script>`);
});

app.post('/verify', (req, res) => {
  let sid = req.body.sid;
  if (!sid) return res.json({ ok: false });
  sid = sid.trim().toUpperCase();
  if (sid.length < 5) return res.json({ ok: false });
  if (verified[sid]) return res.json({ ok: true, token: verified[sid] });
  let tok = Math.floor(100000 + Math.random() * 900000).toString();
  verified[sid] = tok; tokens[tok] = sid;
  res.json({ ok: true, token: tok });
});

// TABLE 2 - NO RESULTS BUTTON
app.get('/table2', (req, res) => {
  let pre = req.query.token || '';
  res.send(`
<style>body{margin:0;font-family:Arial;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden}.top{background:#0a1931;padding:26px 24px}.title{color:#fff;font-size:32px;font-weight:800}.blue{color:#5fa8ff}.bottom{padding:28px 22px}input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px}button{width:100%;margin-top:16px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:800}</style>
<div class="card"><div class="top"><div class="title">Major<span class="blue">Tech</span> Vote</div><div style="color:#8aa0c6">Enter 6-digit token</div></div><div class="bottom"><input id="token" value="${pre}" maxlength="6" placeholder="847392"><button onclick="checkToken()">ENTER ></button><div id="err" style="color:red;margin-top:12px"></div><p style="font-size:12px;color:#888;margin-top:14px">Only Token Required - One Vote Per Student</p></div></div>
<script>
async function checkToken(){let t=document.getElementById("token").value.trim();if(t.length!==6){document.getElementById("err").innerText="Enter 6 digits";return}let r=await fetch("/check-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:t})});let d=await r.json();if(d.ok){location.href="/ballot?token="+t}else{document.getElementById("err").innerText=d.message}}
</script>`);
});

app.post('/check-token', (req, res) => {
  let t = req.body.token;
  if (!t) return res.json({ ok: false, message: 'Required' });
  if (!(t in tokens)) return res.json({ ok: false, message: 'Invalid - Go TABLE 1' });
  if (usedTokens.has(t)) return res.json({ ok: false, message: 'Already used' });
  res.json({ ok: true });
});

app.get('/ballot', (req, res) => {
  let t = req.query.token || '';
  res.send(`
<style>body{margin:0;font-family:Arial;background:#5e2cff;min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden}.top{background:#0a1931;padding:26px 24px;color:#fff}.bottom{padding:22px}button{width:100%;padding:16px;margin:8px 0;background:#5e00ff;color:#fff;border:none;border-radius:14px;font-weight:800;font-size:16px}</style>
<div class="card"><div class="top"><div>Ballot Paper - Token: ${t}</div><div style="font-size:24px;font-weight:800">Select Candidate</div></div><div class="bottom"><button onclick="doVote(1)">Candidate A</button><button onclick="doVote(2)">Candidate B</button><button onclick="doVote(3)">Candidate C</button><div id="out" style="text-align:center;margin-top:12px"></div></div></div>
<script>
let tok="${t}";async function doVote(n){let m={1:"A",2:"B",3:"C"};let c=m[n];let r=await fetch("/vote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:tok,c:c})});let d=await r.json();document.getElementById("out").innerText=d.message;if(d.ok){setTimeout(()=>{location.href="/success?c="+c},800)}}
</script>`);
});

app.post('/vote', (req, res) => {
  let t = req.body.token; let c = req.body.c;
  if (!(t in tokens)) return res.json({ message: 'Invalid', ok: false });
  if (usedTokens.has(t)) return res.json({ message: 'Used', ok: false });
  votes[c]++; total++; usedTokens.add(t);
  res.json({ message: 'Voted ' + c, ok: true });
});

// RESULTS - LOCKED WITH PASSWORD
app.get('/results', (req, res) => {
  if(req.query.key!== ADMIN_KEY){
    return res.send(`
    <style>body{margin:0;font-family:Arial;background:linear-gradient(135deg,#8a7cff,#6a4bff);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:360px;background:#0f1e33;border-radius:24px;padding:26px;text-align:center;color:#fff}input{width:100%;padding:14px;border-radius:12px;border:none;margin:12px 0}button{width:100%;padding:14px;background:#7a3bff;color:#fff;border:none;border-radius:12px;font-weight:800}</style>
    <div class="card"><h2>Results Locked</h2><p style="color:#8aa0c6">Admin Only - Enter Key</p><input id="k" placeholder="Enter Admin Key"><button onclick="location.href='/results?key='+document.getElementById('k').value">UNLOCK LIVE RESULTS</button><p style="font-size:11px;margin-top:12px;opacity:.6">Students cannot view results</p></div>
    `);
  }
  res.send(`
<style>
*{box-sizing:border-box}body{margin:0;font-family:Arial;background:linear-gradient(135deg,#8a7cff,#6a4bff,#4a2ac7);min-height:100vh;padding:18px}
.h1{color:#fff;font-size:36px;font-weight:900}.blue{color:#6dc2ff}
.card-purple{background:linear-gradient(90deg,#4a1fb5,#7a3bff);border-radius:26px;padding:20px 22px;color:#fff;display:flex;justify-content:space-between;align-items:center;max-width:420px;margin:0 auto 16px}
.big{font-size:56px;font-weight:900}.small{font-size:11px}
.card-dark{background:#0f1e33;border-radius:26px;padding:18px;max-width:420px;margin:0 auto 14px;color:#fff}
.bar{height:10px;background:#1e2e4a;border-radius:10px;margin:10px 0}.fill{height:100%;border-radius:10px}
</style>
<div style="max-width:420px;margin:0 auto"><div class="h1">Major<span class="blue">Tech</span><br>Live Results</div><div style="color:#fff;font-size:12px">ADMIN MODE - Key: ${ADMIN_KEY}</div></div>
<div class="card-purple"><div><div class="small">TOTAL VOTES CAST</div><div class="big" id="total">0</div></div><div class="small">IN PROGRESS</div></div>
<div class="card-dark">Candidate A <span id="pA">0%</span><div class="bar"><div class="fill" id="fA" style="width:0%;background:#2ec4ff"></div></div><div id="vA">0 VOTES</div></div>
<div class="card-dark">Candidate B <span id="pB">0%</span><div class="bar"><div class="fill" id="fB" style="width:0%;background:#a98bff"></div></div><div id="vB">0 VOTES</div></div>
<div class="card-dark">Candidate C <span id="pC">0%</span><div class="bar"><div class="fill" id="fC" style="width:0%;background:#ff7a8a"></div></div><div id="vC">0 VOTES</div></div>
<div style="text-align:center;margin-top:12px"><a href="/admin?key=${ADMIN_KEY}" style="color:#fff">Admin Dashboard</a></div>
<script>
function load(){fetch("/api/results").then(r=>r.json()).then(d=>{let tot=d.total;document.getElementById("total").innerText=tot;let pa=0,pb=0,pc=0;if(tot>0){pa=Math.round(d.votes.A/tot*100);pb=Math.round(d.votes.B/tot*100);pc=Math.round(d.votes.C/tot*100);}document.getElementById("pA").innerText=pa+"%";document.getElementById("pB").innerText=pb+"%";document.getElementById("pC").innerText=pc+"%";document.getElementById("fA").style.width=pa+"%";document.getElementById("fB").style.width=pb+"%";document.getElementById("fC").style.width=pc+"%";document.getElementById("vA").innerText=d.votes.A+" VOTES";document.getElementById("vB").innerText=d.votes.B+" VOTES";document.getElementById("vC").innerText=d.votes.C+" VOTES";})}load();setInterval(load,2000);
</script>
`);
});

// SUCCESS - NO RESULTS LINK FOR STUDENTS
app.get('/success', (req, res) => {
  let c = req.query.c || 'A';
  res.send(`
  <style>body{margin:0;font-family:Arial;background:#0f1e33;color:#fff;min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:380px;background:#1a2b4a;border-radius:24px;padding:28px;text-align:center}.check{width:80px;height:80px;background:#00e676;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 16px;color:#000}a{color:#8aa0c6;text-decoration:none;font-size:12px}</style>
  <div class="card"><div class="check">✓</div><div style="font-size:24px;font-weight:900">Vote Successful!</div><div style="margin-top:8px;color:#a98bff">You voted for Candidate ${c}</div><div style="margin-top:18px;padding:14px;background:#0f1e33;border-radius:14px;font-size:13px;color:#8aa0c6">Your vote is secured. Please leave the booth. Results are for admin only.</div>
  <div style="margin-top:22px;display:flex;justify-content:center;gap:18px">
    <a href="/results" style="border:1px solid #2a3b5a;padding:8px 14px;border-radius:20px">Admin / Faculty</a>
    <a href="/" style="border:1px solid #2a3b5a;padding:8px 14px;border-radius:20px">Table 1</a>
  </div>
  <div style="margin-top:14px;font-size:10px;opacity:.4">MajorTech Election System</div></div>
  `);
});

app.get('/api/results', (req, res) => { res.json({ votes, total, verified, used: usedTokens.size }); });

app.get('/admin', (req, res) => {
  if(req.query.key!== ADMIN_KEY){
    return res.send(`<div style="font-family:Arial;background:#0f1e33;min-height:100vh;display:flex;justify-content:center;align-items:center;color:#fff"><div style="background:#1a2b4a;padding:24px;border-radius:16px;width:100%;max-width:360px;text-align:center"><h3>Admin Locked</h3><input id="k" placeholder="Enter Admin Key" style="width:100%;padding:12px;border-radius:10px;border:none"><br><br><button onclick="location.href='/admin?key='+document.getElementById('k').value" style="padding:12px 20px;background:#7a3bff;color:#fff;border:none;border-radius:10px;font-weight:800;width:100%">UNLOCK</button></div></div>`);
  }
  res.send(`
  <style>body{font-family:Arial;padding:20px;background:#0f1e33;color:#fff}.card{background:#1a2b4a;padding:20px;border-radius:16px;max-width:600px;margin:auto}button{padding:12px 20px;border:none;border-radius:10px;font-weight:800;cursor:pointer}.danger{background:#ff3b3b;color:#fff}</style>
  <div class="card"><h2>MajorTech Admin</h2><div id="d">Loading...</div><br>
  <button onclick="if(confirm('WIPE ALL?'))location.href='/admin/reset?key=${ADMIN_KEY}'" class="danger">RESET ALL</button>
  <button onclick="location.href='/results?key=${ADMIN_KEY}'" style="background:#7a3bff;color:#fff;margin-left:8px">View Results</button>

  <script>
  fetch("/api/results").then(r=>r.json()).then(d=>{
    let h="<b>Total:</b> "+d.total+"<br><b>Used:</b> "+d.used+"<br><hr><b>Votes:</b><br>";
    for(let k in d.votes){h+=k+": "+d.votes[k]+"<br>"}h+="<hr><b>Verified IDs:</b><br>";
    if(d.verified){for(let k in d.verified){h+=k+" => "+d.verified[k]+"<br>"}}
    document.getElementById("d").innerHTML=h; 
 }
</div>
</script>
</body></html>
`);
});

app.get('/admin/reset', (req, res) => {
  if(req.query.key!== ADMIN_KEY){ return res.status(403).send('FORBIDDEN - Wrong Key'); }
  verified={};tokens={};votes={A:0,B:0,C:0};total=0;usedTokens.clear();
  res.send(`<div style="font-family:Arial;padding:40px;text-align:center"><h1>WIPED!</h1><p>All reset to 0</p><a href="/admin?key=${ADMIN_KEY}">Back to Admin</a></div>`);
});

module.exports = app;
