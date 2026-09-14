const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== CONFIG - YOUR REAL DATA ==========
const CANDIDATES = [
{ id: 'A', name: 'William Kollie', party: 'Student Reform Party', photo: 'https://i.pravatar.cc/300?img=12', color: '#1e90ff' },
{ id: 'B', name: 'James Peters', party: 'Unity Party', photo: 'https://i.pravatar.cc/300?img=8', color: '#ff416c' },
{ id: 'C', name: 'Princess Doe', party: 'Change Party', photo: 'https://i.pravatar.cc/300?img=5', color: '#56ab2f' }
];

let validStudents = ["037-2025-26", "038-2025-26", "039-2025-26", "2023/001", "2023/002"];
let votedIDs = new Set(); // IDs who already voted
let tokens = new Map(); // token -> {studentID, used: false}
let votes = { A: 0, B: 0, C: 0 };
let totalVoters = 0;

// ========== HELPERS ==========
function genToken() { return 'LIB-' + Math.random().toString(36).substring(2,7).toUpperCase(); }

const layout = (title, body) => &lt;html&gt;&lt;head&gt;&lt;title&gt;${title}</title><meta name="viewport" content="width=device-width,initial-scale=1">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
body{font-family:Arial;background:#f0f2f5;margin:0;padding:0}
.nav{background:#0a3d62;color:white;padding:15px;display:flex;gap:15px;justify-content:center;position:sticky;top:0;z-index:10}
.nav a{color:white;text-decoration:none;background:rgba(255,255,255,0.15);padding:8px 15px;border-radius:20px}
.card{background:white;padding:25px;margin:20px auto;max-width:600px;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.1)}
input,button{width:100%;padding:14px;margin:8px 0;border-radius:8px;border:1px solid #ddd;font-size:16px}
button{background:#0a3d62;color:white;border:none;font-weight:bold;cursor:pointer}
button:hover{background:#1e6091}
.cand{display:flex;align-items:center;gap:15px;padding:15px;border:2px solid #eee;border-radius:10px;margin:10px 0;cursor:pointer}
.cand.selected{border-color:#0a3d62;background:#eaf4ff}
.cand img{width:70px;height:70px;border-radius:50%;object-fit:cover}
.badge{padding:4px 10px;border-radius:20px;color:white;font-size:12px}
</style></head><body>
<div class="nav">
<a href="/table1">TABLE 1 - ID Check</a>
<a href="/table2">TABLE 2 - Vote</a>
<a href="/dashboard">TABLE 3 - Dashboard</a>
</div>
${body} &lt;/body&gt;&lt;/html>;

// ========== TABLE 1 ==========
app.get('/', (req,res)=> res.redirect('/table1'));

app.get('/table1', (req,res)=>{
res.send(layout('Table 1 - Generate Token', &lt;div class="card"&gt; &lt;h2&gt;🔐 TABLE 1 - Voter Verification&lt;/h2&gt; &lt;p&gt;Officer: Enter Student ID / Voter ID to verify&lt;/p&gt; &lt;input id="sid" placeholder="e.g. 037-2025-26" /&gt; &lt;button onclick="gen()"&gt;Verify & Generate Token&lt;/button&gt; &lt;div id="result" style="margin-top:20px;font-weight:bold"&gt;&lt;/div&gt; &lt;p style="margin-top:20px;font-size:13px;color:#666"&gt;Voted IDs: &lt;span id="voted"&gt;${[...votedIDs].join(', ') || 'None'}</span></p>
</div>
<script>
async function gen(){
const id=document.getElementById('sid').value.trim();
if(!id) return alert('Enter ID');
const r=await fetch('/api/generate-token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentID:id})});
const d=await r.json();
document.getElementById('result').innerHTML = d.success?
'<div style="background:#d4edda;padding:15px;border-radius:8px">✅ Verified!<br>Token: <b style="font-size:22px">'+d.token+'</b><br><small>Give this to voter for Table 2</small><br><button onclick="navigator.clipboard.writeText(\''+d.token+'\')">Copy Token</button></div>'
: '<div style="background:#f8d7da;padding:15px;border-radius:8px">❌ '+d.message+'</div>';
if(d.votedList) document.getElementById('voted').innerText=d.votedList.join(', ');
}
</script>
`));
});

// ========== TABLE 2 ==========
app.get('/table2', (req,res)=>{
const candsHtml = CANDIDATES.map(c=>&lt;div class="cand" id="cand-${c.id}" onclick="select('{c.photo}" />
<div style="flex:1"><b>{c.party}</small><br><span class="badge" style="background:{c.id}</span></div>
<div>○</div>
</div>
).join(''); res.send(layout('Table 2 - Vote',
<div class="card">
<h2>🗳️ TABLE 2 - Cast Your Vote</h2>
<p>Transparency: Your ID is NOT linked to vote. Only anonymous token is used.</p>
<input id="token" placeholder="Enter Token from Table 1 e.g. LIB-ABC12" />
<button onclick="check()">Validate Token</button>
<div id="voteArea" style="display:none">
<h3>Select Candidate - Photos Visible</h3>
${candsHtml} &lt;button onclick="vote()" style="background:#27ae60;margin-top:15px"&gt;CONFIRM VOTE&lt;/button&gt; &lt;/div&gt; &lt;div id="msg" style="margin-top:15px"&gt;&lt;/div&gt; &lt;/div&gt; &lt;script&gt; let selected=null; function select(id){ selected=id; document.querySelectorAll('.cand').forEach(e=&gt;e.classList.remove('selected')); document.getElementById('cand-'+id).classList.add('selected'); } async function check(){ const token=document.getElementById('token').value.trim(); const r=await fetch('/api/validate-token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token})}); const d=await r.json(); document.getElementById('msg').innerText=d.message; if(d.success) document.getElementById('voteArea').style.display='block'; } async function vote(){ if(!selected) return alert('Select candidate'); const token=document.getElementById('token').value.trim(); const r=await fetch('/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,candidateID:selected})}); const d=await r.json(); document.getElementById('msg').innerHTML = d.success? '&lt;div style="background:#d4edda;padding:15px;border-radius:8px"&gt;✅ Vote Success! Token BURNED: '+token+'&lt;br&gt;Voted for Candidate '+selected+'&lt;/div&gt;' : '&lt;div style="background:#f8d7da;padding:15px;border-radius:8px"&gt;❌ '+d.message+'&lt;/div&gt;'; if(d.success) document.getElementById('voteArea').style.display='none'; } &lt;/script&gt;));
});

// ========== DASHBOARD ==========
app.get('/dashboard', (req,res)=>{
res.send(layout('Live Dashboard', &lt;div style="background:#0a3d62;color:white;padding:20px;text-align:center"&gt; &lt;h1&gt;LIBERIA ELECTION - LIVE RESULTS DASHBOARD&lt;/h1&gt; &lt;p&gt;Candidates sit here comfortably - Transparent & Professional&lt;/p&gt; &lt;h2&gt;Total Votes: &lt;span id="total"&gt;0&lt;/span&gt; | Turnout: &lt;span id="turnout"&gt;0%&lt;/span&gt;&lt;/h2&gt; &lt;p&gt;Auto-refresh every 2 seconds&lt;/p&gt; &lt;/div&gt; &lt;div style="text-align:center" id="cards"&gt;&lt;/div&gt; &lt;div style="max-width:700px;margin:20px auto;background:white;padding:20px;border-radius:10px"&gt; &lt;canvas id="pie"&gt;&lt;/canvas&gt; &lt;canvas id="bar" style="margin-top:30px"&gt;&lt;/canvas&gt; &lt;/div&gt; &lt;div id="winner" style="text-align:center;font-size:22px;font-weight:bold;margin:20px"&gt;&lt;/div&gt; &lt;script&gt; let pieChart, barChart; function init(){ pieChart=new Chart(document.getElementById('pie'),{type:'doughnut',data:{labels:${JSON.stringify(CANDIDATES.map(c=>c.name))},datasets:[{data:[0,0,0],backgroundColor:latex
{JSON.stringify(CANDIDATES.map(c=&gt;c.color))}}]},options:{plugins:{title:{display:true,text:'Vote Share %'}}}}); barChart=new Chart(document.getElementById('bar'),{type:'bar',data:{labels:

{JSON.stringify(CANDIDATES.map(c=>c.name))},datasets:[{label:'Votes',data:[0,0,0],backgroundColor:$`{JSON.stringify(CANDIDATES.map(c=>c.color))}}]},options:{plugins:{title:{display:true,text:'Live Count per Candidate'}}}});
}
init();
async function load(){
const r=await fetch('/api/results'); const d=await r.json();
document.getElementById('total').innerText=d.total;
document.getElementById('turnout').innerText=d.turnout+'%';
const counts=[d.counts.A||0,d.counts.B||0,d.counts.C||0];
pieChart.data.datasets[0].data=counts; pieChart.update();
barChart.data.datasets[0].data=counts; barChart.update();

let html='';
let max=0, win='';
${JSON.stringify(CANDIDATES)}.forEach((c,i)=&gt;{ const v=counts[i]; const perc=d.total?Math.round(v/d.total*100):0; if(v&gt;max){max=v; win=c.name} html+='&lt;div style="background:white;display:inline-block;width:260px;margin:10px;padding:15px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);border:'+(v==max&&d.total&gt;0?'3px solid gold':'')+'"&gt;&lt;img src="'+c.photo+'" style="width:80px;height:80px;border-radius:50%"&gt;&lt;h3&gt;'+c.name+'&lt;/h3&gt;&lt;small&gt;'+c.party+'&lt;/small&gt;&lt;div style="font-size:28px"&gt;'+v+' votes&lt;/div&gt;&lt;div&gt;'+perc+'%&lt;/div&gt;&lt;div style="background:#eee;height:10px;border-radius:10px;margin-top:5px"&gt;&lt;div style="width:'+perc+'%;background:'+c.color+';height:10px;border-radius:10px"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;'; }); document.getElementById('cards').innerHTML=html; if(d.total&gt;0) document.getElementById('winner').innerHTML='🏆 LEADING: '+win+' with '+max+' votes ('+Math.round(max/d.total*100)+'%)'; } setInterval(load,2000); load(); &lt;/script&gt;));
});

// ========== APIs ==========
app.post('/api/generate-token', (req,res)=>{
const {studentID}=req.body;
if(!validStudents.includes(studentID)) return res.json({success:false,message:'ID not in voter roll',votedList:[...votedIDs]});
if(votedIDs.has(studentID)) return res.json({success:false,message:'BLOCKED! ID '+studentID+' ALREADY VOTED! Cannot use again!',votedList:[...votedIDs]});
const token=genToken();
tokens.set(token,{studentID,used:false});
votedIDs.add(studentID);
res.json({success:true,token,votedList:[...votedIDs]});
});

app.post('/api/validate-token', (req,res)=>{
const {token}=req.body;
const t=tokens.get(token);
if(!t) return res.json({success:false,message:'Invalid Token'});
if(t.used) return res.json({success:false,message:'Token already BURNED - already voted!'});
res.json({success:true,message:'✅ Token Valid - Select Candidate Photo'});
});

app.post('/api/vote', (req,res)=>{
const {token,candidateID}=req.body;
const t=tokens.get(token);
if(!t) return res.json({success:false,message:'Invalid Token'});
if(t.used) return res.json({success:false,message:'Token already used!'});
if(!votes.hasOwnProperty(candidateID)) return res.json({success:false,message:'Invalid Candidate'});
votes[candidateID];
totalVoters;
t.used=true;
tokens.set(token,t);
res.json({success:true,message:'Vote counted'});
});

app.get('/api/results', (req,res)=>{
const total=Object.values(votes).reduce((a,b)=>a+b,0);
const turnout = validStudents.length? Math.round(votedIDs.size/validStudents.length*100) : 0;
res.json({counts:votes,total,turnout,votedCount:votedIDs.size,totalEligible:validStudents.length});
});

module.exports = app;
