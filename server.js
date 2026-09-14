const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CANDIDATES = [
{ id: 'A', name: 'William Kollie', party: 'Reform Party', photo: 'https://i.pravatar.cc/300?img=12' },
{ id: 'B', name: 'James Peters', party: 'Unity Party', photo: 'https://i.pravatar.cc/300?img=8' },
{ id: 'C', name: 'Princess Doe', party: 'Change Party', photo: 'https://i.pravatar.cc/300?img=5' }
];

let validStudents = ["037-2025-26", "038-2025-26", "039-2025-26", "2023/001"];
let votedIDs = new Set();
let tokens = new Map();
let votes = { A: 0, B: 0, C: 0 };

function genToken() { return 'LIB-' + Math.random().toString(36).substring(2,7).toUpperCase(); }

function layout(title, body) {
return '<html><head><title>' + title + '</title><meta name="viewport" content="width=device-width,initial-scale=1"><script src="https://cdn.jsdelivr.net/npm/chart.js"></script><style>body{font-family:Arial;background:#f0f2f5;margin:0}.nav{background:#0a3d62;color:white;padding:15px;display:flex;gap:10px;justify-content:center}.nav a{color:white;text-decoration:none;background:rgba(255,255,255,0.2);padding:8px 12px;border-radius:20px}.card{background:white;padding:20px;margin:20px auto;max-width:600px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1)} input,button{width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #ddd;box-sizing:border-box} button{background:#0a3d62;color:white;font-weight:bold;cursor:pointer}.cand{display:flex;align-items:center;gap:10px;padding:12px;border:2px solid #eee;border-radius:10px;margin:8px 0;cursor:pointer}.cand.selected{border-color:#0a3d62;background:#eaf4ff}.cand img{width:60px;height:60px;border-radius:50%;object-fit:cover}</style></head><body><div class="nav"><a href="/table1">TABLE 1</a><a href="/table2">TABLE 2</a><a href="/dashboard">DASHBOARD</a></div>' + body + '</body></html>';
}

app.get('/', (req,res)=> res.redirect('/table1'));

app.get('/table1', (req,res)=>{
const html = '<div class="card"><h2>TABLE 1 - Verification Officer</h2><p>Enter Student ID to generate token</p><input id="sid" placeholder="037-2025-26"><button onclick="gen()">Generate Token</button><div id="r" style="margin-top:15px;padding:10px;background:#f8f9fa;border-radius:8px"></div></div><script>async function gen(){const id=document.getElementById("sid").value.trim(); const res=await fetch("/api/generate-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentID:id})}); const d=await res.json(); document.getElementById("r").innerHTML=d.success? "<b style=color:green>TOKEN: "+d.token+"</b><br>Give this to voter for Table 2" : "<b style=color:red>"+d.message+"</b>"; }</script>';
res.send(layout('Table1', html));
});

app.get('/table2', (req,res)=>{
let cands = '';
for(let c of CANDIDATES){ cands += '<div class="cand" id="cand-'+c.id+'" onclick="select(''+c.id+'')"><img src="'+c.photo+'"><div><b>'+c.name+'</b><br><small>'+c.party+'</small></div></div>'; }
const html = '<div class="card"><h2>TABLE 2 - Voting (Photos)</h2><input id="token" placeholder="Paste LIB- token"><button onclick="check()">Validate Token</button><div id="msg" style="margin:10px 0;font-weight:bold"></div><div id="voteArea" style="display:none"><h3>Select Candidate</h3>'+cands+'<button onclick="vote()" style="background:#27ae60">CONFIRM VOTE</button></div></div><script>let sel=null; function select(id){sel=id; document.querySelectorAll(".cand").forEach(e=>e.classList.remove("selected")); document.getElementById("cand-"+id).classList.add("selected");} async function check(){const t=document.getElementById("token").value.trim(); const r=await fetch("/api/validate-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:t})}); const d=await r.json(); document.getElementById("msg").innerText=d.message; if(d.success) document.getElementById("voteArea").style.display="block";} async function vote(){if(!sel){alert("Select candidate");return;} const t=document.getElementById("token").value.trim(); const r=await fetch("/api/vote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:t,candidateID:sel})}); const d=await r.json(); document.getElementById("msg").innerText=d.message; if(d.success) document.getElementById("voteArea").style.display="none";}</script>';
res.send(layout('Table2', html));
});

app.get('/dashboard', (req,res)=>{
const html = '<div class="card" style="text-align:center"><h1>LIVE RESULTS</h1><h2>Total Votes: <span id="total">0</span></h2><canvas id="pie" style="max-width:400px;margin:auto"></canvas><div id="cards" style="margin-top:15px"></div><div id="winner" style="margin-top:15px;font-size:20px;font-weight:bold;color:#0a3d62"></div></div><script>let pie; function init(){pie=new Chart(document.getElementById("pie"),{type:"doughnut",data:{labels:["William Kollie","James Peters","Princess Doe"],datasets:[{data:[0,0,0],backgroundColor:["#1e90ff","#ff416c","#56ab2f"]}]},options:{responsive:true}});} init(); async function load(){const r=await fetch("/api/results"); const d=await r.json(); document.getElementById("total").innerText=d.total; pie.data.datasets[0].data=[d.counts.A,d.counts.B,d.counts.C]; pie.update(); let html=""; const names=["William Kollie","James Peters","Princess Doe"]; const vals=[d.counts.A,d.counts.B,d.counts.C]; let max=0,win=""; for(let i=0;i<3;i++){ if(vals[i]>max){max=vals[i]; win=names[i];} let perc=d.total?Math.round(vals[i]/d.total*100):0; html+="<div style=background:#f8f9fa;padding:10px;margin:5px;border-radius:8px><b>"+names[i]+"</b>: "+vals[i]+" votes ("+perc+"%)</div>"; } document.getElementById("cards").innerHTML=html; if(d.total>0) document.getElementById("winner").innerHTML="LEADING: "+win+" with "+max+" votes";} setInterval(load,2000); load();</script>';
res.send(layout('Dashboard', html));
});

app.post('/api/generate-token', (req,res)=>{
const s = req.body.studentID;
if(!validStudents.includes(s)) return res.json({success:false,message:'ID not found'});
if(votedIDs.has(s)) return res.json({success:false,message:'Already voted!'});
const t=genToken(); tokens.set(t,{studentID:s,used:false}); votedIDs.add(s);
res.json({success:true,token:t});
});
app.post('/api/validate-token', (req,res)=>{
const t=tokens.get(req.body.token);
if(!t) return res.json({success:false,message:'Invalid token'});
if(t.used) return res.json({success:false,message:'Token already used - burned!'});
res.json({success:true,message:'Valid token - you can vote now'});
});
app.post('/api/vote', (req,res)=>{
const t=tokens.get(req.body.token);
if(!t || t.used) return res.json({success:false,message:'Invalid or used token'});
if(!votes.hasOwnProperty(req.body.candidateID)) return res.json({success:false,message:'Invalid candidate'});
votes[req.body.candidateID]++; t.used=true;
res.json({success:true,message:'Vote counted! Token burned.'});
});
app.get('/api/results', (req,res)=>{
const total=votes.A+votes.B+votes.C;
res.json({counts:votes,total});
});

module.exports = app;
