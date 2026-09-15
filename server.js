const express = require('express');
const app = express();
app.use(express.json());

let votes = { A: 0, B: 0, C: 0 };
let total = 0;
let usedTokens = new Set();
let verifiedList = [];
const ADMIN_KEY = "Major2025!";

const HEAD = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>
*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(135deg,#7b8cff,#5e2cff,#4a1ac7);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3)}
.top{background:#0a1931;padding:26px 24px}.title{color:#fff;font-size:34px;font-weight:800;line-height:1.1}.blue{color:#5fa8ff}.sub{color:#8aa0c6;font-size:13px;margin-top:8px}
.bottom{padding:28px 22px}.label{color:#5b6b86;font-size:12px;font-weight:700;letter-spacing:1px;margin-bottom:8px}
input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px;font-size:16px}button{width:100%;margin-top:16px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:800;cursor:pointer}
.tokenBox{margin-top:20px;background:#f1f5f9;padding:16px;border-radius:16px;text-align:center;display:none}.tokenNum{font-size:32px;font-weight:900;letter-spacing:4px;color:#0a1931}
.foot{display:flex;justify-content:space-between;padding:12px 20px;background:#f8fafc;color:#94a3b8;font-size:10px}
a{color:#5e2cff;font-size:13px}
</style></head><body>`;

app.get('/', (req,res)=>{
 res.send(`${HEAD}<div class="card"><div class="top"><div style="font-size:10px;color:#cbd5e1;border:1px solid #334155;display:inline-block;padding:5px 10px;border-radius:20px">TABLE 1 | VERIFICATION DESK | MAJORTECH OS</div><div class="title">Major<span class="blue">Tech</span> Verify</div><div class="sub">Liberia Institute | Official Student ID<br>Verification and Token Engine</div></div><div class="bottom"><div class="label">ENTER STUDENT ID NUMBER</div><input id="sid" placeholder="LISE-032-2025"><button onclick="verify()">VERIFY ></button><div id="result" class="tokenBox"><div style="font-size:11px;color:#64748b">VERIFIED - YOUR 6-DIGIT TOKEN</div><div id="tok" class="tokenNum"></div><div id="idshow" style="font-size:11px;color:#64748b;margin-top:6px"></div><div style="margin-top:10px"><a href="/view">View All Verified</a> | <a href="/admin">Admin</a></div></div></div><div class="foot"><span>SECURE | ENCRYPTED</span><span>POWERED BY MAJORTECH</span></div></div>
 <script>
 async function verify(){
  let id=document.getElementById('sid').value.trim();
  if(!id) return alert('Enter ID');
  let r=await fetch('/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentId:id})});
  let d=await r.json();
  if(d.error) return alert(d.error);
  document.getElementById('result').style.display='block';
  document.getElementById('tok').innerText=d.token;
  document.getElementById('idshow').innerText='ID: '+id+' - Use this token in TABLE 2';
 }
 </script></body></html>`);
});

app.post('/verify',(req,res)=>{
 let {studentId}=req.body;
 if(!studentId) return res.json({error:'Enter ID'});
 let token=Math.floor(100000+Math.random()*900000).toString();
 verifiedList.push({id:studentId,token,time:new Date().toLocaleString()});
 res.json({token});
});

app.get('/table2',(req,res)=>{
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title">Major<span class="blue">Tech</span> Vote</div><div class="sub">Enter token from Table 1</div></div><div class="bottom"><input id="t" placeholder="6-digit token"><button onclick="go()">ENTER ></button></div></div><script>function go(){let t=document.getElementById('t').value; if(!t)return alert('Enter token'); location.href='/ballot?token='+t;}</script></body></html>`);
});

app.get('/ballot',(req,res)=>{
 let t=req.query.token||'';
 if(usedTokens.has(t)) return res.send(`${HEAD}<div class="card"><div class="bottom"><h3>Token Used Already</h3></div></div></body></html>`);
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title" style="font-size:22px">Ballot - ${t}</div></div><div class="bottom"><button onclick="vote('A')" style="background:#6d28d9;color:#fff">Candidate A</button><button onclick="vote('B')" style="background:#6d28d9;color:#fff">Candidate B</button><button onclick="vote('C')" style="background:#6d28d9;color:#fff">Candidate C</button></div></div><script>async function vote(c){let r=await fetch('/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:'${t}',candidate:c})});let d=await r.json();if(d.error)alert(d.error);else location.href='/results';}</script></body></html>`);
});

app.post('/vote',(req,res)=>{
 if(usedTokens.has(req.body.token)) return res.json({error:'Used'});
 votes[req.body.candidate]++; total++; usedTokens.add(req.body.token);
 res.json({ok:true});
});

app.get('/results',(req,res)=>{
 res.send(`${HEAD}<div class="card"><div class="bottom"><h3>Voting In Progress</h3><p>Total votes: ${total}</p><a href="/admin"><button>Admin Login</button></a></div></div></body></html>`);
});

app.get('/admin',(req,res)=>{
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title">Admin Login</div></div><div class="bottom"><input id="k" type="password" placeholder="Major2025!"><button onclick="location.href='/admin/dash?key='+document.getElementById('k').value">LOGIN</button></div></div></body></html>`);
});

app.get('/admin/dash',(req,res)=>{
 if(req.query.key!=='Major2025!') return res.send('Wrong key');
 res.send(`${HEAD}<div class="card"><div class="top"><div class="title">Live Results ${total} votes</div></div><div class="bottom"><p>A: ${votes.A}</p><p>B: ${votes.B}</p><p>C: ${votes.C}</p></div></div></body></html>`);
});

app.get('/view',(req,res)=>{
 let html=verifiedList.map(v=>`<div>${v.id} - ${v.token}</div>`).join('');
 res.send(`${HEAD}<div class="card"><div class="bottom"><h3>All Verified</h3>${html}</div></div></body></html>`);
});

module.exports=app;
