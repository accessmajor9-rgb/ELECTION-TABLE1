const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CANDIDATES = [
{ id: 'A', name: 'William Kollie', party: 'Reform Party', photo: 'https://i.pravatar.cc/300?img=12', color: '#1e90ff' },
{ id: 'B', name: 'James Peters', party: 'Unity Party', photo: 'https://i.pravatar.cc/300?img=8', color: '#ff416c' },
{ id: 'C', name: 'Princess Doe', party: 'Change Party', photo: 'https://i.pravatar.cc/300?img=5', color: '#56ab2f' }
];

let validStudents = ["037-2025-26", "038-2025-26", "2023/001"];
let votedIDs = new Set();
let tokens = new Map();
let votes = { A: 0, B: 0, C: 0 };

function genToken() { return 'LIB-' + Math.random().toString(36).substring(2,7).toUpperCase(); }

function layout(title, body) {
return '<html><head><title>'+title+'</title><meta name="viewport" content="width=device-width,initial-scale=1"><script src="https://cdn.jsdelivr.net/npm/chart.js"></script><style>body{font-family:Arial;background:#f0f2f5;margin:0}.nav{background:#0a3d62;color:white;padding:15px;display:flex;gap:10px;justify-content:center}.nav a{color:white;text-decoration:none;background:rgba(255,255,255,0.2);padding:8px 12px;border-radius:20px}.card{background:white;padding:20px;margin:20px auto;max-width:600px;border-radius:10px} input,button{width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #ddd} button{background:#0a3d62;color:white;font-weight:bold;cursor:pointer}.cand{display:flex;align-items:center;gap:10px;padding:10px;border:2px solid #eee;border-radius:10px;margin:8px 0;cursor:pointer}.cand.selected{border-color:#0a3d62;background:#eaf4ff}.cand img{width:60px;height:60px;border-radius:50%}</style></head><body><div class="nav"><a href="/table1">TABLE1</a><a href="/table2">TABLE2</a><a href="/dashboard">DASHBOARD</a></div>'+body+'</body></html>';
}

app.get('/', (req,res)=> res.redirect('/table1'));

app.get('/table1', (req,res)=>{
res.send(layout('Table1', '<div class="card"><h2>TABLE 1 - Verification</h2><input id="sid" placeholder="Enter ID"><button onclick="gen()">Generate Token</button><div id="r" style="margin-top:15px"></div></div><script>async function gen(){const id=document.getElementById("sid").value.trim(); const res=await fetch("/api/generate-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentID:id})}); const d=await res.json(); document.getElementById("r").innerHTML=d.success? "<b>Token: "+d.token+"</b>" : "Error: "+d.message; }</script>'));
});

app.get('/table2', (req,res)=>{
let h='';
for(let c of CANDIDATES){ h+='<div class="cand" id="cand-'+c.id+'" onclick="select(''+c.id+'')"><img src="'+c.photo+'"><div><b>'+c.name+'</b><br>'+c.party+'</div></div>'; }
res.send(layout('Table2', '<div class="card"><h2>TABLE 2 - Vote</h2><input id="token" placeholder="Enter Token"><button onclick="check()">Validate</button><div id="voteArea" style="display:none"><h3>Select Candidate</h3>'+h+'<button onclick="vote()" style="background:#27ae60">CONFIRM VOTE</button></div><div id="msg"></div></div><script>let sel=null; function select(id){sel=id; document.querySelectorAll(".cand").forEach(e=>e.classList.remove("selected")); document.getElementById("cand-"+id).classList.add("selected");} async function check(){const t=document.getElementById("token").value; const r=await fetch("/api/validate-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:t})}); const d=await r.json(); document.getElementById("msg").innerText=d.message; if(d.success) document.getElementById("voteArea").style.display="block";} async function vote(){const t=document.getElementById("token").value; const r=await fetch("/api/vote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:t,candidateID:sel})}); const d=await r.json(); document.getElementById("msg").innerText=d.message;}</script>'));
});

app.get('/dashboard', (req,res)=>{
res.send(layout('Dashboard', '<div class="card" style="text-align:center"><h1>LIVE DASHBOARD</h1><h2>Total: <span id="total">0</span></h2><canvas id="pie"></canvas><div id="cards"></div><div id="winner"></div></div><script>let pie; function init(){pie=new Chart(document.getElementById("pie"),{type:"doughnut",data:{labels:["William","James","Princess"],datasets:[{data:[0,0,0],backgroundColor:["#1e90ff","#ff416c","#56ab2f"]}]}});} init(); async function load(){const r=await fetch("/api/results"); const d=await r.json(); document.getElementById("total").innerText=d.total; pie.data.datasets[0].data=[d.counts.A,d.counts.B,d.counts.C]; pie.update(); let html=""; const names=["William Kollie","James Peters","Princess Doe"]; const vals=[d.counts.A,d.counts.B,d.counts.C]; let max=0,win=""; for(let i=0;i<3;i++){ if(vals[i]>max){max=vals[i]; win=names[i];} let perc=d.total?Math.round(vals[i]/d.total*100):0; html+="<div style=\"background:#f8f9fa;padding:10px;margin:5px;border-radius:8px\"><b>"+names[i]+"</b>: "+vals[i]+" votes ("+perc+"%)</div>"; } document.getElementById("cards").innerHTML=html; if(d.total>0) document.getElementById("winner").innerHTML="<h2>LEADING: "+win+"</h2>";} setInterval(load,2000); load();</script>'));
});

app.post('/api/generate-token', (req,res)=>{
const s=req.body.studentID;
if(!validStudents.includes(s)) return res.json({success:false,message:'ID not found'});
if(votedIDs.has(s)) return res.json({success:false,message:'Already voted!'});
const t=genToken(); tokens.set(t,{studentID:s,used:false}); votedIDs.add(s);
res.json({success:true,token:t});
});
app.post('/api/validate-token', (req,res)=>{
const t=tokens.get(req.body.token);
if(!t) return res.json({success:false,message:'Invalid token'});
if(t.used) return res.json({success:false,message:'Token burned'});
res.json({success:true,message:'Valid - vote now'});
});
app.post('/api/vote', (req,res)=>{
const t=tokens.get(req.body.token);
if(!t || t.used) return res.json({success:false,message:'Invalid or used token'});
votes[req.body.candidateID]++; t.used=true;
res.json({success:true,message:'Vote counted! Token burned.'});
});
app.get('/api/results', (req,res)=>{
const total=votes.A+votes.B+votes.C;
res.json({counts:votes,total});
});

module.exports = app;
