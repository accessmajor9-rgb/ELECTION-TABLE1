const express=require('express');
const app=express();
app.use(express.json());
let votes={A:0,B:0,C:0};
let total=0;
let voted=new Set();
app.get('/',(req,res)=>{
let L=String.fromCharCode(60);
let R=String.fromCharCode(62);
let h=L+'style'+R+'body{font-family:Arial;background:#f0e6ff;text-align:center;padding:20px}.box{background:#fff;max-width:400px;margin:auto;padding:20px;border-radius:16px}h1{color:#6a00ff}button{width:100%;padding:14px;margin:8px 0;background:#6a00ff;color:#fff;border:none;border-radius:10px;font-weight:bold;font-size:16px}'+L+'/style'+R;
h+=L+'h1'+R+'MajorTech - TABLE 1'+L+'/h1'+R+L+'div class=box'+R;
h+=L+'h2'+R+'Vote Now'+L+'/h2'+R;
h+=L+'button onclick=v(1)'+R+'Candidate A'+L+'/button'+R;
h+=L+'button onclick=v(2)'+R+'Candidate B'+L+'/button'+R;
h+=L+'button onclick=v(3)'+R+'Candidate C'+L+'/button'+R;
h+=L+'div id=m style=margin:10px;color:green;font-weight:bold'+R+L+'/div'+R;
h+=L+'p'+R+L+'a href=/results'+R+'View Results'+L+'/a'+R+' | '+L+'a href=/admin'+R+'Admin'+L+'/a'+R+L+'/p'+R+L+'/div'+R;
h+=L+'script'+R+'async function v(n){let m={1:"A",2:"B",3:"C"};let c=m[n];let r=await fetch("/vote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({c:c})});let d=await r.json();document.getElementById("m").innerText=d.message}'+L+'/script'+R;
res.send(h);
});
app.get('/results',(req,res)=>{
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
res.send(L+'h1'+R+'Results'+L+'/h1'+R+L+'div id=b'+R+'Loading...'+L+'/div'+R+L+'script'+R+'async function l(){let r=await fetch("/api/results");let d=await r.json();let h="Total Votes: "+d.total+"<br><br>";for(let k in d.votes){h+=k+": "+d.votes[k]+" votes<br>"}document.getElementById("b").innerHTML=h}l();setInterval(l,3000)'+L+'/script'+R+L+'br'+R+L+'a href=/'+R+'Back to Vote'+L+'/a'+R);
});
app.post('/vote',(req,res)=>{
let ip=req.headers['x-forwarded-for']||req.socket.remoteAddress||'ip';
if(voted.has(ip))return res.json({message:'You already voted!'});
let c=req.body.c;
if(votes[c]!undefined){votes[c];total;voted.add(ip);return res.json({message:'Success! Voted for '+c})}
res.json({message:'Invalid candidate'});
});
app.get('/api/results',(req,res)=>res.json({votes,total}));
app.get('/admin',(req,res)=>{let L=String.fromCharCode(60);let R=String.fromCharCode(62);res.send(L+'h1'+R+'Admin Login'+L+'/h1'+R+L+'input id=u placeholder=Username value=admin'+R+L+'input id=p type=password placeholder=Password'+R+L+'button onclick=login()'+R+'Login'+L+'/button'+R+L+'div id=msg'+R+L+'/div'+R+L+'script'+R+'async function login(){let r=await fetch("/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({p:p.value})});let d=await r.json();if(d.ok)location.href="/admin/dashboard";else msg.innerText="Wrong password"}'+L+'/script'+R)});
app.post('/admin/login',(req,res)=>{if(req.body.p='majortech123')return res.json({ok:true});res.json({ok:false})});
app.get('/admin/dashboard',(req,res)=>{
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
res.send(L+'h1'+R+'Admin Dashboard - TABLE 1'+L+'/h1'+R+'<div id=d>Loading...</div>'+L+'br'+R+L+'a href=/admin/reset'+R+'Reset All Votes'+L+'/a'+R+' | '+L+'a href=/'+R+'Home'+L+'/a'+R+L+'script'+R+'fetch("/api/results").then(r=>r.json()).then(d=>{document.getElementById("d").innerHTML="Total: "+d.total+"<br>A: "+d.votes.A+"<br>B: "+d.votes.B+"<br>C: "+d.votes.C})'+L+'/script'+R);
});
app.get('/admin/reset',(req,res)=>{votes={A:0,B:0,C:0};total=0;voted.clear();res.redirect('/admin/dashboard')});
module.exports=app;
