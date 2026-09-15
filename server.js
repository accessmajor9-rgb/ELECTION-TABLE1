const express=require('express');
const app=express();
app.use(express.json());
let verified={};
let tokens={};
let votes={A:0,B:0,C:0};
let total=0;
let usedTokens=new Set();

function pageWrap(body){
let L=String.fromCharCode(60);
let R=String.fromCharCode(62);
return L+'style'+R+'*{box-sizing:border-box}body{margin:0;font-family:Arial;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3)}.top{background:#0a1931;padding:26px 24px 22px}.pill{display:inline-block;border:1px solid rgba(255,255,255,.25);color:#cbd5e1;font-size:11px;letter-spacing:1px;padding:8px 14px;border-radius:20px;background:rgba(255,255,255,.08)}.title{margin:18px 0 6px;color:#fff;font-size:32px;font-weight:800}.blue{color:#5fa8ff}.sub{color:#8aa0c6;font-size:14px}.bottom{padding:28px 22px}.label{color:#5b6b86;font-size:12px;letter-spacing:1.5px;font-weight:700;margin-bottom:10px}input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px;font-size:16px}button.verify{width:100%;margin-top:16px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:800}button.cand{width:100%;padding:16px;margin:8px 0;background:#6a00ff;color:#fff;border:none;border-radius:14px;font-weight:800;font-size:16px}.foot{display:flex;justify-content:space-between;padding:14px 22px;background:#f8fafc;color:#9aa9c0;font-size:10px}'+L+'/style'+R+body;
}

app.get('/',function(req,res){
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
let body=L+'div class=card'+R+L+'div class=top'+R+L+'div class=pill'+R+'TABLE 1 | VERIFICATION DESK | MAJORTECH OS'+L+'/div'+R+L+'div class=title'+R+'Major'+L+'span class=blue'+R+'Tech'+L+'/span'+R+' Verify'+L+'/div'+R+L+'div class=sub'+R+'Liberia Institute | Official Student ID<br>Verification and Token Engine'+L+'/div'+R+L+'/div'+R+L+'div class=bottom'+R+L+'div class=label'+R+'ENTER STUDENT ID NUMBER'+L+'/div'+R+L+'input id=sid placeholder="e.g. LISE-037-2025"'+R+L+'button class=verify onclick=doVerify()'+R+'VERIFY >'+L+'/button'+R+L+'div id=out style=display:none;margin-top:18px;padding:16px;background:#f0f5ff;border-radius:16px'+R+L+'div style=font-size:12px'+R+'YOUR 6-DIGIT TOKEN'+L+'/div'+R+L+'div id=tok style=font-size:32px;font-weight:900;letter-spacing:4px'+R+''+L+'/div'+R+L+'div id=msg style=font-size:13px'+R+''+L+'/div'+R+L+'a href=/table2 style=display:block;margin-top:12px;background:#00c853;color:#fff;text-align:center;padding:12px;border-radius:12px;text-decoration:none'+R+'Go to TABLE 2 -> Vote'+L+'/a'+R+L+'/div'+R+L+'/div'+R+L+'div class=foot'+R+L+'span'+R+'SECURE | ENCRYPTED'+L+'/span'+R+L+'span'+R+'POWERED BY MAJORTECH'+L+'/span'+R+L+'/div'+R+L+'/div'+R+L+'script'+R+'async function doVerify(){let id=document.getElementById("sid").value.trim();if(!id){alert("Enter ID");return}let r=await fetch("/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sid:id})});let d=await r.json();if(d.ok){let o=document.getElementById("out");o.style.display="block";document.getElementById("tok").innerText=d.token;document.getElementById("msg").innerText="ID: "+id} else alert(d.msg)}'+L+'/script'+R;
res.send(pageWrap(body));
});

app.post('/verify',function(req,res){
let sid=req.body.sid;
if(!sid){return res.json({ok:false,msg:'ID required'})}
sid=sid.trim().toUpperCase();
if(sid.length<5){return res.json({ok:false,msg:'Invalid ID'})}
if(sid in verified){return res.json({ok:true,token:verified[sid]})}
let tok=Math.floor(100000+Math.random()*900000).toString();
verified[sid]=tok;
tokens[tok]=sid;
res.json({ok:true,token:tok});
});

app.get('/table2',function(req,res){
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
let body=L+'div class=card'+R+L+'div class=top'+R+L+'div class=pill'+R+'TABLE 2 | VOTING BOOTH | MAJORTECH OS'+L+'/div'+R+L+'div class=title'+R+'Major'+L+'span class=blue'+R+'Tech'+L+'/span'+R+' Vote'+L+'/div'+R+L+'div class=sub'+R+'Enter your 6-digit token to vote'+L+'/div'+R+L+'/div'+R+L+'div class=bottom'+R+L+'div class=label'+R+'ENTER 6-DIGIT TOKEN'+L+'/div'+R+L+'input id=token placeholder="e.g. 847392" maxlength=6'+R+L+'div class=label style=margin-top:16px'+R+'SELECT CANDIDATE'+L+'/div'+R+L+'button class=cand onclick=doVote(1)'+R+'Candidate A'+L+'/button'+R+L+'button class=cand onclick=doVote(2)'+R+'Candidate B'+L+'/button'+R+L+'button class=cand onclick=doVote(3)'+R+'Candidate C'+L+'/button'+R+L+'div id=out style=margin-top:16px;font-weight:bold'+R+''+L+'/div'+R+L+'p'+R+L+'a href=/'+R+'Back to TABLE 1'+L+'/a'+R+' | '+L+'a href=/results'+R+'Results'+L+'/a'+R+L+'/p'+R+L+'/div'+R+L+'div class=foot'+R+'SECURE | ONE TOKEN ONE VOTE'+L+'/div'+R+L+'/div'+R+L+'script'+R+'async function doVote(n){let t=document.getElementById("token").value.trim();if(t.length!=6){alert("Enter 6-digit token");return}let m={1:"A",2:"B",3:"C"};let c=m[n];let r=await fetch("/vote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:t,c:c})});let d=await r.json();document.getElementById("out").innerText=d.message}'+L+'/script'+R;
res.send(pageWrap(body));
});

app.post('/vote',function(req,res){
let t=req.body.token;
let c=req.body.c;
if(!t||!c){return res.json({message:'Token and candidate required'})}
if(!(t in tokens)){return res.json({message:'Invalid token - Go to TABLE 1 first'})}
if(usedTokens.has(t)){return res.json({message:'This token already used - One token one vote'})}
if(!(c in votes)){return res.json({message:'Invalid candidate'})}
votes[c];
total;
usedTokens.add(t);
res.json({message:'SUCCESS! Voted for '+c+' with token '+t});
});

app.get('/results',function(req,res){
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
let body=L+'div class=card'+R+L+'div class=top'+R+L+'div class=title'+R+'Results'+L+'/div'+R+L+'/div'+R+L+'div class=bottom'+R+'<div id=b>Loading</div><br><a href=/table2>Back to Vote</a> | <a href=/>Table 1</a></div><div class=foot>TABLE 1 + 2 LIVE</div></div><script>function load(){fetch("/api/results").then(function(r){return r.json()}).then(function(d){let h="Total Votes: "+d.total+"<br><br>";for(let k in d.votes){h+=k+": "+d.votes[k]+" votes<br>"}h+="<br>Verified IDs: "+Object.keys(d.verified).length+"<br>Used Tokens: "+d.used;document.getElementById("b").innerHTML=h})}load();setInterval(load,3000)</script>';
res.send(pageWrap(body));
});

app.get('/api/results',function(req,res){res.json({votes,total,verified,used:usedTokens.size})});
app.get('/admin/dashboard',function(req,res){
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
let body=L+'div class=card'+R+L+'div class=top'+R+L+'div class=title'+R+'Dashboard'+L+'/div'+R+L+'/div'+R+L+'div class=bottom'+R+'<div id=d>Loading</div><br><a href=/admin/reset>Reset All</a> | <a href=/>Home</a></div></div><script>fetch("/api/results").then(function(r){return r.json()}).then(function(d){let h="Total: "+d.total+"<br>";for(let k in d.votes){h+=k+": "+d.votes[k]+"<br>"}h+="<hr>";for(let k in d.verified){h+=k+" => "+d.verified[k]+"<br>"}document.getElementById("d").innerHTML=h})</script>';
res.send(pageWrap(body));
});
app.get('/admin',function(req,res){res.redirect('/admin/dashboard')});
app.get('/admin/reset',function(req,res){verified={};tokens={};votes={A:0,B:0,C:0};total=0;usedTokens.clear();res.redirect('/')});
module.exports=app;
