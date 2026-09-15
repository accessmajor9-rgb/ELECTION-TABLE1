const express=require('express');
const app=express();
app.use(express.json());
let votes={A:0,B:0,C:0};
let total=0;
let voted=new Set();
app.get('/',function(req,res){
let L=String.fromCharCode(60);
let R=String.fromCharCode(62);
let h=L+'style'+R+'body{font-family:Arial;background:#f0e6ff;text-align:center;padding:20px}.box{background:#fff;max-width:400px;margin:auto;padding:20px;border-radius:16px}h1{color:#6a00ff}button{width:100%;padding:14px;margin:8px 0;background:#6a00ff;color:#fff;border:none;border-radius:10px;font-weight:bold}'+L+'/style'+R;
h+=L+'h1'+R+'MajorTech TABLE 1'+L+'/h1'+R+L+'div class=box'+R;
h+=L+'h2'+R+'Vote Now'+L+'/h2'+R;
h+=L+'button onclick=v(1)'+R+'Candidate A'+L+'/button'+R;
h+=L+'button onclick=v(2)'+R+'Candidate B'+L+'/button'+R;
h+=L+'button onclick=v(3)'+R+'Candidate C'+L+'/button'+R;
h+=L+'div id=m'+R+L+'/div'+R;
h+=L+'p'+R+L+'a href=/results'+R+'Results'+L+'/a'+R+' | '+L+'a href=/admin'+R+'Admin'+L+'/a'+R+L+'/p'+R+L+'/div'+R;
h+=L+'script'+R+'async function v(n){let m={1:"A",2:"B",3:"C"};let c=m[n];let r=await fetch("/vote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({c:c})});let d=await r.json();document.getElementById("m").innerText=d.message}'+L+'/script'+R;
res.send(h);
});
app.get('/results',function(req,res){
let L=String.fromCharCode(60);
let R=String.fromCharCode(62);
let html=L+'h1'+R+'Results'+L+'/h1'+R+L+'div id=b'+R+'Loading'+L+'/div'+R+L+'script'+R+'function load(){fetch("/api/results").then(function(r){return r.json()}).then(function(d){let h="Total: "+d.total+"<br>";for(let k in d.votes){h+=k+": "+d.votes[k]+"<br>"}document.getElementById("b").innerHTML=h})}load();setInterval(load,3000)'+L+'/script'+R+L+'a href=/'+R+'Back'+L+'/a'+R;
res.send(html);
});
app.post('/vote',function(req,res){
let ip=req.headers['x-forwarded-for'];
if(!ip){ip=req.socket.remoteAddress}
if(voted.has(ip)){return res.json({message:'Already voted'})}
let c=req.body.c;
if(c in votes){votes[c];total;voted.add(ip);return res.json({message:'Voted '+c})}
res.json({message:'Invalid'});
});
app.get('/api/results',function(req,res){res.json({votes,total})});
app.get('/admin',function(req,res){
let L=String.fromCharCode(60);
let R=String.fromCharCode(62);
res.send(L+'h1'+R+'Admin - Click to Enter'+L+'/h1'+R+L+'a href=/admin/dashboard'+R+'Enter Dashboard'+L+'/a'+R);
});
app.get('/admin/dashboard',function(req,res){
let L=String.fromCharCode(60);
let R=String.fromCharCode(62);
res.send(L+'h1'+R+'Dashboard'+L+'/h1'+R+'<div id=d>Loading</div>'+L+'br'+R+L+'a href=/admin/reset'+R+'Reset'+L+'/a'+R+' | '+L+'a href=/'+R+'Home'+L+'/a'+R+L+'script'+R+'fetch("/api/results").then(function(r){return r.json()}).then(function(d){document.getElementById("d").innerHTML="Total: "+d.total+"<br>A: "+d.votes.A+"<br>B: "+d.votes.B+"<br>C: "+d.votes.C})'+L+'/script'+R);
});
app.get('/admin/reset',function(req,res){votes={A:0,B:0,C:0};total=0;voted.clear();res.redirect('/admin/dashboard')});
module.exports=app;
