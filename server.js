const express = require('express');
const app = express();
app.use(express.json());

let valid = ['037-2025-26','038-2025-26','039-2025-26'];
let voted = new Set();
let tokens = new Map();
let votes = {A:0,B:0,C:0};

function genToken(){
return 'LIB-' + Math.random().toString(36).substring(2,7).toUpperCase();
}
function nav(){
return <div style="background:#0a3d62;color:white;padding:12px;text-align:center"&gt; &lt;a href="/table1" style="color:white;margin:10px"&gt;TABLE1&lt;/a&gt; &lt;a href="/table2" style="color:white;margin:10px"&gt;TABLE2&lt;/a&gt; &lt;a href="/dashboard" style="color:white;margin:10px"&gt;DASHBOARD&lt;/a&gt; &lt;/div>;
}

app.get('/', (req,res)=> res.redirect('/table1'));

app.get('/table1', (req,res)=>{
res.send(nav() + &lt;div style="max-width:500px;margin:20px auto;background:white;padding:20px"&gt; &lt;h2&gt;TABLE 1&lt;/h2&gt; &lt;input id="sid" placeholder="Enter ID" style="width:100%;padding:10px"&gt; &lt;button onclick="gen()" style="width:100%;padding:10px;background:#0a3d62;color:white"&gt;Generate Token&lt;/button&gt; &lt;div id="r" style="margin-top:10px"&gt;&lt;/div&gt; &lt;/div&gt; &lt;script&gt; async function gen(){ let id=document.getElementById('sid').value.trim(); let r=await fetch('/api/generate-token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentID:id})}); let d=await r.json(); document.getElementById('r').innerHTML=d.token?'&lt;b&gt;TOKEN: '+d.token+'&lt;/b&gt;':d.message } &lt;/script&gt;);
});

app.get('/table2', (req,res)=>{
res.send(nav() + &lt;div style="max-width:500px;margin:20px auto;background:white;padding:20px"&gt; &lt;h2&gt;TABLE 2&lt;/h2&gt; &lt;input id="tok" placeholder="Paste Token" style="width:100%;padding:10px"&gt; &lt;button onclick="check()" style="width:100%;padding:10px"&gt;Validate&lt;/button&gt; &lt;div id="msg"&gt;&lt;/div&gt; &lt;div id="area" style="display:none"&gt; &lt;div onclick="sel='A'" style="border:1px solid #ddd;padding:10px;margin:5px"&gt;William Kollie - A&lt;/div&gt; &lt;div onclick="sel='B'" style="border:1px solid #ddd;padding:10px;margin:5px"&gt;James Peters - B&lt;/div&gt; &lt;div onclick="sel='C'" style="border:1px solid #ddd;padding:10px;margin:5px"&gt;Princess Doe - C&lt;/div&gt; &lt;button onclick="vote()" style="width:100%;padding:10px;background:green;color:white"&gt;CONFIRM VOTE&lt;/button&gt; &lt;/div&gt; &lt;/div&gt; &lt;script&gt; let sel=null; async function check(){ let t=document.getElementById('tok').value; let r=await fetch('/api/validate-token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:t})}); let d=await r.json(); document.getElementById('msg').innerText=d.message; if(d.success) document.getElementById('area').style.display='block'; } async function vote(){ let t=document.getElementById('tok').value; let r=await fetch('/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:t,candidateID:sel})}); let d=await r.json(); document.getElementById('msg').innerText=d.message; } &lt;/script&gt;);
});

app.get('/dashboard', (req,res)=>{
res.send(nav() + &lt;div style="max-width:600px;margin:20px auto;background:white;padding:20px;text-align:center"&gt; &lt;h1&gt;LIVE DASHBOARD&lt;/h1&gt;&lt;h2&gt;Total: &lt;span id="tot"&gt;0&lt;/span&gt;&lt;/h2&gt;&lt;div id="res"&gt;&lt;/div&gt;&lt;div id="win"&gt;&lt;/div&gt; &lt;/div&gt; &lt;script&gt; async function load(){ let r=await fetch('/api/results');let d=await r.json(); document.getElementById('tot').innerText=d.total; let names=['William','James','Princess'];let vals=[d.counts.A,d.counts.B,d.counts.C]; let html='';let max=0,win=''; for(let i=0;i&lt;3;i++){if(vals[i]&gt;max){max=vals[i];win=names[i]}let perc=d.total?Math.round(vals[i]/d.total*100):0;html+='&lt;div style=padding:10px;background:#f0f0f0;margin:5px&gt;'+names[i]+': '+vals[i]+' ('+perc+'%)&lt;/div&gt;'} document.getElementById('res').innerHTML=html; if(d.total&gt;0)document.getElementById('win').innerHTML='&lt;h2&gt;LEADING: '+win+'&lt;/h2&gt;'; } setInterval(load,2000);load(); &lt;/script&gt;);
});

app.post('/api/generate-token', (req,res)=>{
let s=req.body.studentID;
if(!valid.includes(s)) return res.json({message:'ID not found'});
if(voted.has(s)) return res.json({message:'Already voted'});
let t=genToken();tokens.set(t,{used:false});voted.add(s);
res.json({token:t,success:true});
});

app.post('/api/validate-token', (req,res)=>{
let t=tokens.get(req.body.token);
if(!t) return res.json({message:'Invalid token',success:false});
if(t.used) return res.json({message:'Token burned',success:false});
res.json({message:'Valid token',success:true});
});

app.post('/api/vote', (req,res)=>{
let t=tokens.get(req.body.token);
if(!t||t.used) return res.json({message:'Invalid token'});
votes[req.body.candidateID]++;t.used=true;
res.json({message:'Vote counted!'});
});

app.get('/api/results', (req,res)=>{
let total=votes.A+votes.B+votes.C;
res.json({counts:votes,total});
});

module.exports=app;
