const express=require('express');
const app=express();
app.use(express.json());
let verified={};
let tokens={};
let votes={A:0,B:0,C:0};
let total=0;
let usedTokens=new Set();

function wrap(body){
let L=String.fromCharCode(60);
let R=String.fromCharCode(62);
return L+'style'+R+'*{box-sizing:border-box}body{margin:0;font-family:Arial;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3)}.top{background:#0a1931;padding:26px 24px}.pill{display:inline-block;border:1px solid rgba(255,255,255,.25);color:#cbd5e1;font-size:11px;padding:8px 14px;border-radius:20px;background:rgba(255,255,255,.08)}.title{margin:18px 0 6px;color:#fff;font-size:32px;font-weight:800}.blue{color:#5fa8ff}.sub{color:#8aa0c6;font-size:14px}.bottom{padding:28px 22px}.label{color:#5b6b86;font-size:12px;letter-spacing:1.5px;font-weight:700;margin-bottom:10px}input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px;font-size:16px}button.verify{width:100%;margin-top:16px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:800}button.cand{width:100%;padding:16px;margin:8px 0;background:#5e00ff;color:#fff;border:none;border-radius:14px;font-weight:800;font-size:16px}.foot{display:flex;justify-content:space-between;padding:14px 22px;background:#f8fafc;color:#9aa9c0;font-size:10px}'+L+'/style'+R+body;
}

app.get('/',function(req,res){
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
let body=L+'div class=card'+R+L+'div class=top'+R+L+'div class=pill'+R+'TABLE 1 | VERIFICATION DESK | MAJORTECH OS'+L+'/div'+R+L+'div class=title'+R+'Major'+L+'span class=blue'+R+'Tech'+L+'/span'+R+' Verify'+L+'/div'+R+L+'div class=sub'+R+'Liberia Institute | Official Student ID<br>Verification and Token Engine'+L+'/div'+R+L+'/div'+R+L+'div class=bottom'+R+L+'div class=label'+R+'ENTER STUDENT ID NUMBER'+L+'/div'+R+L+'input id=sid placeholder="e.g. LISE-037-2025"'+R+L+'button class=verify onclick=doVerify()'+R+'VERIFY >'+L+'/button'+R+L+'div id=out style=display:none;margin-top:18px;padding:16px;background:#f0f5ff;border-radius:16px'+R+L+'div style=font-size:12px'+R+'YOUR 6-DIGIT TOKEN'+L+'/div'+R+L+'div id=tok style=font-size:32px;font-weight:900;letter-spacing:4px'+R+''+L+'/div'+R+L+'div id=msg style=font-size:13px;margin-top:6px'+R+''+L+'/div'+R+L+'button onclick=go2() style=width:100%;margin-top:12px;padding:12px;background:#00c853;color:#fff;border:none;border-radius:12px;font-weight:800'+R+'Go to TABLE 2 ->'+L+'/button'+R+L+'/div'+R+L+'/div'+R+L+'div class=foot'+R+'SECURE | ENCRYPTED'+L+'/div'+R+L+'/div'+R+L+'script'+R+'let lastTok="";async function doVerify(){let id=document.getElementById("sid").value.trim();if(!id){alert("Enter ID");return}let r=await fetch("/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sid:id})});let d=await r.json();if(d.ok){lastTok=d.token;let o=document.getElementById("out");o.style.display="block";document.getElementById("tok").innerText=d.token;document.getElementById("msg").innerText="ID: "+id}}function go2(){if(lastTok){location.href="/table2?token="+lastTok}else{location.href="/table2"}}'+L+'/script'+R;
res.send(wrap(body));
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
let preTok=req.query.token||'';
let body=L+'div class=card'+R+L+'div class=top'+R+L+'div class=pill'+R+'TABLE 2 | VOTING BOOTH | MAJORTECH OS'+L+'/div'+R+L+'div class=title'+R+'Major'+L+'span class=blue'+R+'Tech'+L+'/span'+R+' Vote'+L+'/div'+R+L+'div class=sub'+R+'Enter your 6-digit token to vote'+L+'/div'+R+L+'/div'+R+L+'div class=bottom'+R+L+'div class=label'+R+'ENTER 6-DIGIT TOKEN'+L+'/div'+R+L+'input id=token placeholder="e.g. 847392" maxlength=6 value="'+preTok+'"'+R+L+'button class=verify onclick=checkToken()'+R+'ENTER >'+L+'/button'+R+L+'div id=err style=color:red;margin-top:12px;font-weight:bold'+R+''+L+'/div'+R+L+'p style=margin-top:16px'+R+L+'a href=/'+R+'Back to TABLE 1'+L+'/a'+R+' | '+L+'a href=/results'+R+'Results'+L+'/a'+R+L+'/p'+R+L+'/div'+R+L+'div class=foot'+R+'SECURE | ONE TOKEN ONE VOTE'+L+'/div'+R+L+'/div'+R+L+'script'+R+'async function checkToken(){let t=document.getElementById("token").value.trim();if(t.length<6||t.length>6){document.getElementById("err").innerText="Enter 6 digits";return}let r=await fetch("/check-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:t})});let d=await r.json();if(d.ok){location.href="/ballot?token="+t}else{document.getElementById("err").innerText=d.message}}'+L+'/script'+R;
res.send(wrap(body));
});

app.post('/check-token',function(req,res){
let t=req.body.token;
if(!t){return res.json({ok:false,message:'Token required'})}
if(!(t in tokens)){return res.json({ok:false,message:'Invalid token - Go to TABLE 1'})}
if(usedTokens.has(t)){return res.json({ok:false,message:'Token already used'})}
res.json({ok:true});
});

app.get('/ballot',function(req,res){
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
let t=req.query.token||'';
let body=L+'div class=card'+R+L+'div class=top'+R+L+'div class=pill'+R+'TABLE 2 | BALLOT PAPER | MAJORTECH OS'+L+'/div'+R+L+'div class=title'+R+'Select Candidate'+L+'/div'+R+L+'div class=sub'+R+'Token: '+t+L+'/div'+R+L+'/div'+R+L+'div class=bottom'+R+L+'div class=label'+R+'SELECT CANDIDATE'+L+'/div'+R+L+'button class=cand onclick=doVote(1)'+R+'Candidate A'+L+'/button'+R+L+'button class=cand onclick=doVote(2)'+R+'Candidate B'+L+'/button'+R+L+'button class=cand onclick=doVote(3)'+R+'Candidate C'+L+'/button'+R+L+'div id=out style=margin-top:16px;font-weight:bold;text-align:center'+R+''+L+'/div'+R+L+'/div'+R+L+'div class=foot'+R+'Token '+t+L'/div'+R+L+'/div'+R+L+'script'+R+'let tok="'+t+'";async function doVote(n){let m={1:"A",2:"B",3:"C"};let c=m[n];let r=await fetch("/vote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:tok,c:c})});let d=await r.json();document.getElementById("out").innerText=d.message;if(d.ok){setTimeout(function(){location.href="/success?c="+c},800)}}'+L+'/script'+R;
res.send(wrap(body));
});

app.post('/vote',function(req,res){
let t=req.body.token;
let c=req.body.c;
if(!t||!c){return res.json({message:'Missing',ok:false})}
if(!(t in tokens)){return res.json({message:'Invalid token',ok:false})}
if(usedTokens.has(t)){return res.json({message:'Token already used',ok:false})}
if(!(c in votes)){return res.json({message:'Invalid candidate',ok:false})}
votes[c];
total;
usedTokens.add(t);
res.json({message:'Voted for '+c,ok:true});
});

// NEW LIVE RESULTS DESIGN - LIKE YOUR SCREENSHOT
app.get('/results',function(req,res){
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
let page=L+'style'+R+'{box-sizing:border-box}body{margin:0;font-family:Arial;background:linear-gradient(135deg,#8a7cff,#6a4bff,#4a2ac7);min-height:100vh;padding:18px}.header{max-width:420px;margin:0 auto 16px}.h1{color:#fff;font-size:36px;font-weight:900;line-height:1.1}.blue{color:#6dc2ff}.card-purple{background:linear-gradient(90deg,#4a1fb5,#7a3bff);border-radius:26px;padding:20px 22px;color:#fff;display:flex;justify-content:space-between;align-items:center;max-width:420px;margin:0 auto 16px}.big{font-size:56px;font-weight:900;line-height:1}.small{font-size:11px;letter-spacing:1px;opacity:.9}.card-dark{background:#0f1e33;border-radius:26px;padding:18px 18px;max-width:420px;margin:0 auto 14px;color:#fff}.row{display:flex;justify-content:space-between;align-items:center}.icon{width:54px;height:54px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px}.bar{height:10px;background:#1e2e4a;border-radius:10px;margin:14px 0 8px;overflow:hidden}.fill{height:100%;border-radius:10px}.votes{font-size:11px;color:#7a8aa6;letter-spacing:1px}.pct{font-size:32px;font-weight:900}'+L+'/style'+R;
page+=L+'div class=header'+R+L+'div class=h1'+R+'Major'+L+'span class=blue'+R+'Tech'+L+'/span'+R+'<br>Live Results'+L+'/div'+R+L+'/div'+R;
page+=L+'div class=card-purple'+R+L+'div'+R+L+'div class=small'+R+'TOTAL VOTES CAST'+L+'/div'+R+L+'div class=big id=total'+R+'0'+L+'/div'+R+L+'/div'+R+L+'div class=small'+R+'ELECTION IN PROGRESS'+L+'/div'+R+L+'/div'+R;
page+=L+'div class=card-dark'+R+L+'div class=row'+R+L+'div style=display:flex;align-items:center;gap:12px'+R+L+'div class=icon style=background:#2ec4ff'+R+'A'+L+'/div'+R+L+'div style=font-weight:800'+R+'Candidate A'+L+'/div'+R+L+'/div'+R+L+'div class=pct id=pA'+R+'0%'+L+'/div'+R+L+'/div'+R+L+'div class=bar'+R+L+'div class=fill id=fA style=width:0%;background:#2ec4ff'+L+'/div'+R+L+'/div'+R+L+'div class=votes id=vA'+R+'0 VOTES'+L+'/div'+R+L+'/div'+R;
page+=L+'div class=card-dark'+R+L+'div class=row'+R+L+'div style=display:flex;align-items:center;gap:12px'+R+L+'div class=icon style=background:#a98bff'+R+'B'+L+'/div'+R+L+'div style=font-weight:800'+R+'Candidate B'+L+'/div'+R+L+'/div'+R+L+'div class=pct id=pB'+R+'0%'+L+'/div'+R+L+'/div'+R+L+'div class=bar'+R+L+'div class=fill id=fB style=width:0%;background:#a98bff'+L+'/div'+R+L+'/div'+R+L+'div class=votes id=vB'+R+'0 VOTES'+L+'/div'+R+L+'/div'+R;
page+=L+'div class=card-dark'+R+L+'div class=row'+R+L+'div style=display:flex;align-items:center;gap:12px'+R+L+'div class=icon style=background:#ff7a8a'+R+'C'+L+'/div'+R+L+'div style=font-weight:800'+R+'Candidate C'+L+'/div'+R+L+'/div'+R+L+'div class=pct id=pC'+R+'0%'+L+'/div'+R+L+'/div'+R+L+'div class=bar'+R+L+'div class=fill id=fC style=width:0%;background:#ff7a8a'+L+'/div'+R+L+'/div'+R+L+'div class=votes id=vC'+R+'0 VOTES'+L+'/div'+R+L+'/div'+R;
page+=L+'div style=max-width:420px;margin:16px auto;text-align:center'+R+L+'a href=/ style=color:#fff'+R+'Back to TABLE 1'+L+'/a'+R+' | '+L+'a href=/table2 style=color:#fff'+R+'TABLE 2'+L+'/a'+R+L+'/div'+R;
page+=L+'script'+R+'function load(){fetch("/api/results").then(function(r){return r.json()}).then(function(d){let tot=d.total;document.getElementById("total").innerText=tot;let av=d.votes.A;let bv=d.votes.B;let cv=d.votes.C;let pa=0;let pb=0;let pc=0;if(tot>0){pa=Math.round(av/tot100);pb=Math.round(bv/tot100);pc=Math.round(cv/tot100)}document.getElementById("pA").innerText=pa+"%";document.getElementById("pB").innerText=pb+"%";document.getElementById("pC").innerText=pc+"%";document.getElementById("fA").style.width=pa+"%";document.getElementById("fB").style.width=pb+"%";document.getElementById("fC").style.width=pc+"%";document.getElementById("vA").innerText=av+" VOTES";document.getElementById("vB").innerText=bv+" VOTES";document.getElementById("vC").innerText=cv+" VOTES"}) }load();setInterval(load,2000)'+L+'/script'+R;
res.send(page);
});

// NEW SUCCESS MESSAGE - SAME STYLE
app.get('/success',function(req,res){
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
let c=req.query.c||'A';
let page=L+'style'+R+'body{margin:0;font-family:Arial;background:linear-gradient(135deg,#8a7cff,#6a4bff);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:420px;background:#0f1e33;border-radius:28px;padding:28px;text-align:center;color:#fff}.check{width:80px;height:80px;background:#00e676;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 16px}'+L+'/style'+R;
page+=L+'div class=card'+R+L+'div class=check'+R+'✓'+L+'/div'+R+L+'div style=font-size:26px;font-weight:900'+R+'Vote Successful!'+L+'/div'+R+L+'div style=margin-top:10px;color:#a98bff'+R+'You voted for Candidate '+c+L'/div'+R+L+'div style=margin-top:18px;padding:14px;background:#1a2b4a;border-radius:14px'+R+'Thank you - Your vote is counted in Live Results'+L'/div'+R+L+'a href=/results style=display:block;margin-top:20px;padding:14px;background:#7a3bff;color:#fff;border-radius:14px;text-decoration:none;font-weight:800'+R+'View Live Results'+L'/a'+R+L+'/div'+R;
res.send(page);
});

app.get('/api/results',function(req,res){res.json({votes,total,verified,used:usedTokens.size})});
app.get('/admin/dashboard',function(req,res){
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
let body=L+'div class=card'+R+L+'div class=top'+R+L+'div class=title'+R+'Dashboard'+L'/div'+R+L'/div'+R+L+'div class=bottom'+R+'<div id=d>Loading</div><br><a href=/admin/reset>Reset</a> | <a href=/>Home</a> | <a href=/results>Results</a></div></div><script>fetch("/api/results").then(function(r){return r.json()}).then(function(d){let h="Total: "+d.total+"<br>";for(let k in d.votes){h+=k+": "+d.votes[k]+"<br>"}h+="<hr>";for(let k in d.verified){h+=k+" => "+d.verified[k]+"<br>"}document.getElementById("d").innerHTML=h})</script>';
res.send(wrap(body));
});
app.get('/admin',function(req,res){res.redirect('/admin/dashboard')});
app.get('/admin/reset',function(req,res){verified={};tokens={};votes={A:0,B:0,C:0};total=0;usedTokens.clear();res.redirect('/')});
module.exports=app;
