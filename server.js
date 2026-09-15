const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let votes = { "Candidate A": 0, "Candidate B": 0, "Candidate C": 0 };
let total = 0;
let voted = new Set();

function layout(t,b){return \x3c!DOCTYPE html\x3e\x3chtml\x3e\x3chead\x3e\x3cmeta name="viewport" content="width=device-width,initial-scale=1"\x3e\x3ctitle\x3e${t}\x3c/title\x3e\x3cstyle\x3ebody{font-family:Arial;background:#f0e6ff;margin:0;padding:15px;text-align:center}.box{background:#fff;max-width:420px;margin:20px auto;padding:20px;border-radius:16px}h1{color:#6a00ff}button{width:100%;padding:14px;margin:8px 0;background:#6a00ff;color:#fff;border:none;border-radius:10px;font-size:18px;font-weight:bold}input{width:100%;padding:12px;margin:6px 0;border:1px solid #ddd;border-radius:10px;box-sizing:border-box}a{color:#6a00ff}\x3c/style\x3e\x3c/head\x3e\x3cbody\x3e${b}\x3c/body\x3e\x3c/html\x3e;}

app.get('/',(req,res)=>{
res.send(layout('Vote',\x3ch1\x3eMajorTech - TABLE 1\x3c/h1\x3e\x3cdiv class="box"\x3e\x3ch2\x3eVote\x3c/h2\x3e\x3cbutton onclick="v('Candidate A')"\x3eCandidate A\x3c/button\x3e\x3cbutton onclick="v('Candidate B')"\x3eCandidate B\x3c/button\x3e\x3cbutton onclick="v('Candidate C')"\x3eCandidate C\x3c/button\x3e\x3cdiv id="m" style="margin-top:12px;font-weight:bold"\x3e\x3c/div\x3e\x3cp\x3e\x3ca href="/results"\x3eLive Results\x3c/a\x3e | \x3ca href="/admin"\x3eAdmin\x3c/a\x3e\x3c/p\x3e\x3c/div\x3e\x3cscript\x3easync function v(c){let r=await fetch('/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({candidate:c})});let d=await r.json();document.getElementById('m').innerText=d.message}\x3c/script\x3e));
});

app.get('/results',(req,res)=>{
res.send(layout('Results',\x3ch1\x3eTABLE 1 Results\x3c/h1\x3e\x3cdiv class="box" id="b"\x3eLoading...\x3c/div\x3e\x3cp\x3e\x3ca href="/"\x3eBack to Vote\x3c/a\x3e\x3c/p\x3e\x3cscript\x3easync function load(){let r=await fetch('/api/results');let d=await r.json();let h='Total Votes: '+d.total+'\x3cbr\x3e\x3cbr\x3e';for(let k in d.votes){h+=k+': '+d.votes[k]+'\x3cbr\x3e'}document.getElementById('b').innerHTML=h}load();setInterval(load,3000)\x3c/script\x3e));
});

app.get('/admin',(req,res)=>{
res.send(layout('Admin',\x3ch1\x3eAdmin Login\x3c/h1\x3e\x3cdiv class="box"\x3e\x3cinput id="u" placeholder="Username"\x3e\x3cinput id="p" type="password" placeholder="Password"\x3e\x3cbutton onclick="login()"\x3eLogin\x3c/button\x3e\x3cdiv id="msg"\x3e\x3c/div\x3e\x3c/div\x3e\x3cscript\x3easync function login(){let r=await fetch('/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:document.getElementById('u').value,password:document.getElementById('p').value})});let d=await r.json();if(d.ok){location.href='/admin/dashboard'}else{document.getElementById('msg').innerText=d.message}}\x3c/script\x3e));
});

app.get('/admin/dashboard',(req,res)=>{
res.send(layout('Dashboard',\x3ch1\x3eAdmin Dashboard\x3c/h1\x3e\x3cdiv class="box" id="d"\x3e\x3c/div\x3e\x3cp\x3e\x3ca href="/"\x3eHome\x3c/a\x3e | \x3ca href="/admin/reset" onclick="return confirm('Reset all votes?')"\x3eReset Votes\x3c/a\x3e\x3c/p\x3e\x3cscript\x3easync function load(){let r=await fetch('/api/results');let d=await r.json();document.getElementById('d').innerHTML='Total: '+d.total+'\x3cbr\x3eA: '+d.votes['Candidate A']+'\x3cbr\x3eB: '+d.votes['Candidate B']+'\x3cbr\x3eC: '+d.votes['Candidate C']}load()\x3c/script\x3e));
});

app.get('/admin/reset',(req,res)=>{
votes={"Candidate A":0,"Candidate B":0,"Candidate C":0};total=0;voted.clear();
res.redirect('/admin/dashboard');
});

app.post('/vote',(req,res)=>{
let ip=req.headers['x-forwarded-for']||req.socket.remoteAddress;
if(voted.has(ip)) return res.json({message:'You already voted!'});
let c=req.body.candidate;
if(votes[c]!==undefined){votes[c];total;voted.add(ip);return res.json({message:'Vote counted for '+c});}
res.json({message:'Invalid'});
});

app.post('/admin/login',(req,res)=>{
let {username,password}=req.body;
if(username==='admin' && password==='majortech123') return res.json({ok:true});
res.json({ok:false,message:'Wrong login'});
});

app.get('/api/results',(req,res)=>res.json({votes,total}));
module.exports=app;
