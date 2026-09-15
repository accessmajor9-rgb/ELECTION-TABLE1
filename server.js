const express=require('express');
const app=express();
app.use(express.json());
let votes={A:0,B:0,C:0};
let total=0;
let voted=new Set();
app.get('/',(req,res)=>{
let L=String.fromCharCode(60);
let R=String.fromCharCode(62);
let h=L+'h1'+R+'MajorTech TABLE 1'+L+'/h1'+R;
h+=L+'button onclick=v(1)'+R+'Candidate A'+L+'/button'+R+L+'br'+R;
h+=L+'button onclick=v(2)'+R+'Candidate B'+L+'/button'+R+L+'br'+R;
h+=L+'button onclick=v(3)'+R+'Candidate C'+L+'/button'+R;
h+=L+'div id=m'+R+L+'/div'+R;
h+=L+'p'+R+L+'a href=/results'+R+'Results'+L+'/a'+R+' | '+L+'a href=/admin'+R+'Admin'+L+'/a'+R+L+'/p'+R;
h+=L+'script'+R+'async function v(n){let m={1:"A",2:"B",3:"C"};let c=m[n];let r=await fetch("/vote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({c:c})});let d=await r.json();document.getElementById("m").innerText=d.message}'+L+'/script'+R;
res.send(h);
});
app.get('/results',(req,res)=>{
let L=String.fromCharCode(60);
let R=String.fromCharCode(62);
res.send(L+'h1'+R+'Results'+L+'/h1'+R+L+'div id=b'+R+'Loading'+L+'/div'+R+L+'script'+R+'fetch("/api/results").then(r=>r.json()).then(d=>{b.innerHTML="Total:"+d.total+" A:"+d.votes.A+" B:"+d.votes.B+" C:"+d.votes.C})'+L+'/script'+R+L+'a href=/'+R+'Back'+L+'/a'+R);
});
app.post('/vote',(req,res)=>{
let ip=req.headers['x-forwarded-for']||'ip';
if(voted.has(ip))return res.json({message:'Already voted'});
let c=req.body.c;
if(votes[c]!==undefined){votes[c];total;voted.add(ip);return res.json({message:'Voted '+c})}
res.json({message:'Invalid'});
});
app.get('/api/results',(req,res)=>res.json({votes,total}));
app.get('/admin',(req,res)=>res.send('Admin Login - user admin pass majortech123 - go to /admin/dashboard'));
app.get('/admin/dashboard',(req,res)=>res.send('Dashboard Total: '+total+' A:'+votes.A+' B:'+votes.B+' C:'+votes.C+' <a href=/admin/reset>Reset</a>'));
app.get('/admin/reset',(req,res)=>{votes={A:0,B:0,C:0};total=0;voted.clear();res.send('Reset OK <a href="/">Home</a>')});
module.exports=app;
