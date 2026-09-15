const express = require('express');
const app = express();
app.use(express.json());

let votes = {"Candidate A":0,"Candidate B":0,"Candidate C":0};
let total = 0;
let voted = new Set();

app.get('/', (req,res)=>{
res.send('\x3c!DOCTYPE html\x3e\x3chtml\x3e\x3chead\x3e\x3cmeta name="viewport" content="width=device-width,initial-scale=1"\x3e\x3cstyle\x3ebody{font-family:Arial;background:#f0e6ff;text-align:center;padding:20px}.box{background:#fff;max-width:400px;margin:auto;padding:20px;border-radius:16px}h1{color:#6a00ff}button{width:100%;padding:14px;margin:8px 0;background:#6a00ff;color:#fff;border:none;border-radius:10px;font-weight:bold}\x3c/style\x3e\x3c/head\x3e\x3cbody\x3e\x3ch1\x3eMajorTech - TABLE 1\x3c/h1\x3e\x3cdiv class="box"\x3e\x3ch2\x3eVote\x3c/h2\x3e\x3cbutton onclick="v('Candidate A')"\x3eCandidate A\x3c/button\x3e\x3cbutton onclick="v('Candidate B')"\x3eCandidate B\x3c/button\x3e\x3cbutton onclick="v('Candidate C')"\x3eCandidate C\x3c/button\x3e\x3cdiv id="m"\x3e\x3c/div\x3e\x3cp\x3e\x3ca href="/results"\x3eResults\x3c/a\x3e | \x3ca href="/admin"\x3eAdmin\x3c/a\x3e\x3c/p\x3e\x3c/div\x3e\x3cscript\x3easync function v(c){let r=await fetch('/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({candidate:c})});let d=await r.json();document.getElementById('m').innerText=d.message}\x3c/script\x3e\x3c/body\x3e\x3c/html\x3e');
});

app.get('/results',(req,res)=>{
res.send('\x3ch1\x3eResults\x3c/h1\x3e\x3cdiv id="b"\x3eLoading...\x3c/div\x3e\x3cscript\x3easync function load(){let r=await fetch('/api/results');let d=await r.json();let h='Total:'+d.total+'\x3cbr\x3e';for(let k in d.votes){h+=k+':'+d.votes[k]+'\x3cbr\x3e'}document.getElementById('b').innerHTML=h}load();setInterval(load,3000)\x3c/script\x3e\x3ca href="/"\x3eBack\x3c/a\x3e');
});

app.get('/admin',(req,res)=>{
res.send('\x3ch1\x3eAdmin\x3c/h1\x3e\x3cinput id="u" placeholder="Username"\x3e\x3cinput id="p" type="password" placeholder="Password"\x3e\x3cbutton onclick="login()"\x3eLogin\x3c/button\x3e\x3cdiv id="msg"\x3e\x3c/div\x3e\x3cscript\x3easync function login(){let r=await fetch('/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u.value,password:p.value})});let d=await r.json();if(d.ok)location.href='/admin/dashboard';else msg.innerText=d.message}\x3c/script\x3e');
});

app.get('/admin/dashboard',(req,res)=>{
res.send('\x3ch1\x3eDashboard\x3c/h1\x3e\x3cdiv id="d"\x3eLoading...\x3c/div\x3e\x3ca href="/admin/reset"\x3eReset\x3c/a\x3e | \x3ca href="/"\x3eHome\x3c/a\x3e\x3cscript\x3easync function load(){let r=await fetch('/api/results');let d=await r.json();document.getElementById('d').innerHTML='Total:'+d.total+' A:'+d.votes['Candidate A']+' B:'+d.votes['Candidate B']+' C:'+d.votes['Candidate C']}load()\x3c/script\x3e');
});

app.get('/admin/reset',(req,res)=>{votes={"Candidate A":0,"Candidate B":0,"Candidate C":0};total=0;voted.clear();res.redirect('/admin/dashboard');});
app.post('/vote',(req,res)=>{let ip=req.headers['x-forwarded-for']||req.socket.remoteAddress;if(voted.has(ip))return res.json({message:'Already voted'});let c=req.body.candidate;if(votes[c]!undefined){votes[c];total;voted.add(ip);return res.json({message:'Voted '+c})}res.json({message:'Invalid'});});
app.post('/admin/login',(req,res)=>{let u=req.body.username;let p=req.body.password;if(u='admin'&&p==='majortech123')return res.json({ok:true});res.json({ok:false,message:'Wrong'});});
app.get('/api/results',(req,res)=>res.json({votes,total}));
module.exports=app;
