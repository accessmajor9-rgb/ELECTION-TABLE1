const express=require('express');
const app=express();
app.use(express.json());
let votes={A:0,B:0,C:0};
let total=0;
let voted=new Set();
app.get('/',(req,res)=>{
let h="\x3ch1\x3eMajorTech TABLE 1\x3c/h1\x3e";
h+="\x3cbutton onclick="v('A')"\x3eCandidate A\x3c/button\x3e\x3cbr\x3e";
h+="\x3cbutton onclick="v('B')"\x3eCandidate B\x3c/button\x3e\x3cbr\x3e";
h+="\x3cbutton onclick="v('C')"\x3eCandidate C\x3c/button\x3e";
h+="\x3cdiv id='m'\x3e\x3c/div\x3e";
h+="\x3cp\x3e\x3ca href='/results'\x3eResults\x3c/a\x3e | \x3ca href='/admin'\x3eAdmin\x3c/a\x3e\x3c/p\x3e";
h+="\x3cscript\x3easync function v(c){let r=await fetch('/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({c:c})});let d=await r.json();document.getElementById('m').innerText=d.message}\x3c/script\x3e";
res.send(h);
});
app.get('/results',(req,res)=>{
res.send("\x3ch1\x3eResults\x3c/h1\x3e\x3cdiv id='b'\x3eLoading\x3c/div\x3e\x3cscript\x3efetch('/api/results').then(r=>r.json()).then(d=>{b.innerHTML='Total:'+d.total+' A:'+d.votes.A+' B:'+d.votes.B+' C:'+d.votes.C})\x3c/script\x3e\x3ca href='/'\x3eBack\x3c/a\x3e");
});
app.post('/vote',(req,res)=>{
let ip=req.headers['x-forwarded-for']||'ip';
if(voted.has(ip))return res.json({message:'Already voted'});
let c=req.body.c;
if(votes[c]!undefined){votes[c];total;voted.add(ip);return res.json({message:'Voted '+c})}
res.json({message:'Invalid'});
});
app.get('/api/results',(req,res)=>res.json({votes,total}));
app.get('/admin',(req,res)=>res.send("\x3ch1\x3eAdmin\x3c/h1\x3e\x3cinput id='u' placeholder='user'\x3e\x3cinput id='p' type='password'\x3e\x3cbutton onclick='login()'\x3eLogin\x3c/button\x3e\x3cscript\x3easync function login(){let r=await fetch('/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p:p.value})});let d=await r.json();if(d.ok)location.href='/admin/dashboard'}\x3c/script\x3e"));
app.post('/admin/login',(req,res)=>{if(req.body.p='majortech123')return res.json({ok:true});res.json({ok:false})});
app.get('/admin/dashboard',(req,res)=>res.send("\x3ch1\x3eDashboard\x3c/h1\x3e\x3cdiv id='d'\x3e\x3c/div\x3e\x3ca href='/admin/reset'\x3eReset\x3c/a\x3e\x3cscript\x3efetch('/api/results').then(r=>r.json()).then(d=>{d.innerHTML=JSON.stringify(d)})\x3c/script\x3e"));
app.get('/admin/reset',(req,res)=>{votes={A:0,B:0,C:0};total=0;voted.clear();res.send('Reset OK \x3ca href="/"\x3eHome\x3c/a\x3e')});
module.exports=app;
