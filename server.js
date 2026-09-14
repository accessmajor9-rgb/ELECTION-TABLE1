const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let tokens = {};
let votes = { "Candidate A": 0, "Candidate B": 0, "Candidate C": 0 };
let usedPhones = new Set();

app.get('/', (req,res) => res.redirect('/table1'));

app.get('/table1', (req,res) => {
res.send(&lt;html&gt;&lt;head&gt;&lt;title&gt;TABLE 1&lt;/title&gt; &lt;style&gt;body{font-family:Arial;background:#f0f4ff;padding:20px}.box{background:white;max-width:400px;margin:auto;padding:30px;border-radius:10px;box-shadow:0 2px 10px #0002} input{width:100%;padding:12px;margin:10px 0} button{width:100%;padding:12px;background:#2563eb;color:white;border:0;border-radius:6px;font-size:16px}&lt;/style&gt; &lt;/head&gt;&lt;body&gt;&lt;div class="box"&gt;&lt;h2 style="color:#2563eb"&gt;TABLE 1 - Token Generator&lt;/h2&gt; &lt;input id="phone" placeholder="Enter Phone like 037-2025-26" /&gt; &lt;button onclick="gen()"&gt;Generate Token&lt;/button&gt; &lt;div id="out" style="margin-top:20px;font-weight:bold"&gt;&lt;/div&gt; &lt;script&gt; async function gen(){ const phone=document.getElementById('phone').value; const r=await fetch('/api/generate-token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone})}); const d=await r.json(); document.getElementById('out').innerHTML = d.token? 'TOKEN: '+d.token : 'Error: '+d.error; } &lt;/script&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html>);
});

app.get('/table2', (req,res) => {
res.send(&lt;html&gt;&lt;head&gt;&lt;title&gt;TABLE 2&lt;/title&gt; &lt;style&gt;body{font-family:Arial;background:#fff7ed;padding:20px}.box{background:white;max-width:400px;margin:auto;padding:30px;border-radius:10px;box-shadow:0 2px 10px #0002} input,select{width:100%;padding:12px;margin:10px 0} button{width:100%;padding:12px;background:#ea580c;color:white;border:0;border-radius:6px;font-size:16px}&lt;/style&gt; &lt;/head&gt;&lt;body&gt;&lt;div class="box"&gt;&lt;h2 style="color:#ea580c"&gt;TABLE 2 - Vote&lt;/h2&gt; &lt;input id="token" placeholder="Paste Token LIB-XXXXX" /&gt; &lt;select id="cand"&gt;&lt;option&gt;Candidate A&lt;/option&gt;&lt;option&gt;Candidate B&lt;/option&gt;&lt;option&gt;Candidate C&lt;/option&gt;&lt;/select&gt; &lt;button onclick="vote()"&gt;Vote Now&lt;/button&gt; &lt;div id="out" style="margin-top:20px;font-weight:bold"&gt;&lt;/div&gt; &lt;script&gt; async function vote(){ const token=document.getElementById('token').value; const candidate=document.getElementById('cand').value; const r=await fetch('/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,candidate})}); const d=await r.json(); document.getElementById('out').innerHTML = d.success? 'VOTE SUCCESS! '+d.candidate : 'Error: '+d.error; } &lt;/script&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html>);
});

app.get('/dashboard', (req,res) => {
res.send(&lt;html&gt;&lt;head&gt;&lt;title&gt;Dashboard&lt;/title&gt;&lt;meta http-equiv="refresh" content="3"&gt; &lt;style&gt;body{font-family:Arial;padding:20px}.card{border:1px solid #ddd;padding:15px;margin:10px 0;border-radius:8px}&lt;/style&gt; &lt;/head&gt;&lt;body&gt;&lt;h2&gt;Dashboard - Live Results&lt;/h2&gt; &lt;div class="card"&gt;Candidate A: ${votes["Candidate A"]} votes</div>
<div class="card">Candidate B: ${votes["Candidate B"]} votes&lt;/div&gt; &lt;div class="card"&gt;Candidate C: ${votes["Candidate C"]} votes</div>
<div>Total Tokens: ${Object.keys(tokens).length}&lt;/div&gt; &lt;/body&gt;&lt;/html>);
});

app.post('/api/generate-token', (req,res) => {
const {phone} = req.body;
if(!phone) return res.json({error:'Phone required'});
if(usedPhones.has(phone)) return res.json({error:'Phone already used'});
const token = 'LIB-'+Math.random().toString(36).substr(2,5).toUpperCase();
tokens[token]= {phone, used:false};
usedPhones.add(phone);
res.json({token});
});

app.post('/api/vote', (req,res) => {
const {token,candidate} = req.body;
if(!tokens[token]) return res.json({error:'Invalid token'});
if(tokens[token].used) return res.json({error:'Token already used'});
tokens[token].used=true;
if(votes[candidate]!==undefined) votes[candidate]++;
res.json({success:true,candidate});
});

if (require.main === module) {
app.listen(3000, ()=>console.log('Local'));
}
module.exports = app;
