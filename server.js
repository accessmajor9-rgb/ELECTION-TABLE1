const express=require('express');
const app=express();
app.use(express.json());
let verified={};
let tokens={};
let votes={A:0,B:0,C:0};
let total=0;
let usedTokens=new Set();
let LT=String.fromCharCode(60);
let GT=String.fromCharCode(62);

app.get('/',function(req,res){
let html=LT+style+GT+* {box-sizing:border-box} body{margin:0;font-family:Arial;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden}.top{background:#0a1931;padding:26px 24px}.title{color:#fff;font-size:32px;font-weight:800}.blue{color:#5fa8ff}.sub{color:#8aa0c6;font-size:14px}.bottom{padding:28px 22px} input{width:100%;padding:18px;border:2px solid #e2e8f0;border-radius:18px} button{width:100%;margin-top:16px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-weight:800}+LT+/style+GT+LT+div class=card+GT+LT+div class=top+GT+LT+div style=color:#cbd5e1;font-size:11px+GT+TABLE 1 | VERIFICATION DESK+LT+/div+GT+LT+div class=title+GT+Major+LT+span class=blue+GT+Tech+LT+/span+GT+Verify+LT+/div+GT+LT+div class=sub+GT+Liberia Institute | Token Engine+LT+/div+GT+LT+/div+GT+LT+div class=bottom+GT+LT+div+GT+ENTER STUDENT ID+LT+/div+GT+LT+input id=sid placeholder="e.g. LISE-037-2025"+GT+LT+button onclick=doVerify()+GT+VERIFY >+LT+/button+GT+LT+div id=out style=display:none;margin-top:18px;padding:16px;background:#f0f5ff;border-radius:16px+GT+LT+div id=tok style=font-size:32px;font-weight:900+GT+LT+/div+GT+LT+button onclick=go2() style=background:#00c853;margin-top:12px+GT+Go to TABLE 2 ->+LT+/button+GT+LT+/div+GT+LT+script+GT+let lastTok=""; async function doVerify(){ let id=document.getElementById("sid").value.trim(); if(!id){alert("Enter ID");return} let r=await fetch("/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sid:id})}); let d=await r.json(); if(d.ok){lastTok=d.token;let o=document.getElementById("out");o.style.display="block";document.getElementById("tok").innerText=d.token;} } function go2(){if(lastTok){location.href="/table2?token="+lastTok}else{location.href="/table2"}}+LT+/script+GT;
res.send(html);
});

app.post('/verify',function(req,res){
let sid=req.body.sid;
if(!sid){return res.json({ok:false,msg:'ID required'})}
sid=sid.trim().toUpperCase();
if(sid.length<5){return res.json({ok:false,msg:'Invalid'})}
if(sid in verified){return res.json({ok:true,token:verified[sid]})}
let tok=Math.floor(100000+Math.random()*900000).toString();
verified[sid]=tok;tokens[tok]=sid;
res.json({ok:true,token:tok});
});

app.get('/table2',function(req,res){
let pre=req.query.token||'';
let html=LT+div style=font-family:Arial;background:#5e2cff;min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px+GT+LT+div style=background:#fff;border-radius:28px;padding:24px;width:100%;max-width:400px+GT+LT+h2+GT+TABLE 2 - Enter Token+LT+/h2+GT+LT+input id=token value="${pre}" maxlength=6 placeholder="847392" style=width:100%;padding:16px;border-radius:12px;border:2px solid #ccc+GT+LT+button onclick=checkToken() style=width:100%;margin-top:12px;padding:16px;background:#0a1931;color:#fff;border:none;border-radius:12px+GT+ENTER >+LT+/button+GT+LT+div id=err style=color:red;margin-top:10px+GT+LT+/div+GT+LT+p+GT+LT+a href=/+GT+Back+LT+/a+GT+ | +LT+a href=/results+GT+Results+LT+/a+GT+LT+/p+GT+LT+/div+GT+LT+script+GT+
async function checkToken(){
let t=document.getElementById("token").value.trim();
if(t.length<6||t.length>6){document.getElementById("err").innerText="Enter 6 digits";return}
let r=await fetch("/check-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:t})});
let d=await r.json();
if(d.ok){location.href="/ballot?token="+t}else{document.getElementById("err").innerText=d.message}
}
+LT+/script`+GT;
res.send(html);
});

app.post('/check-token',function(req,res){
let t=req.body.token;
if(!t){return res.json({ok:false,message:'Required'})}
if(!(t in tokens)){return res.json({ok:false,message:'Invalid - Go TABLE 1'})}
if(usedTokens.has(t)){return res.json({ok:false,message:'Already used'})}
res.json({ok:true});
});

app.get('/ballot',function(req,res){
let t=req.query.token||'';
let html=LT+div style=font-family:Arial;background:#5e2cff;min-height:100vh;display:flex;justify-content:center;align-items:center+GT+LT+div style=background:#fff;border-radius:28px;padding:24px;width:100%;max-width:400px+GT+LT+h2+GT+Select Candidate - Token${t}+LT+/h2+GT+LT+button onclick=doVote(1) style=width:100%;padding:14px;margin:6px 0;background:#5e00ff;color:#fff;border:none;border-radius:12px+GT+Candidate A+LT+/button+GT+LT+button onclick=doVote(2) style=width:100%;padding:14px;margin:6px 0;background:#5e00ff;color:#fff;border:none;border-radius:12px+GT+Candidate B+LT+/button+GT+LT+button onclick=doVote(3) style=width:100%;padding:14px;margin:6px 0;background:#5e00ff;color:#fff;border:none;border-radius:12px+GT+Candidate C+LT+/button+GT+LT+div id=out+GT+LT+/div+GT+LT+script+GT+
let tok="${t}"; async function doVote(n){ let m={1:"A",2:"B",3:"C"}; let c=m[n]; let r=await fetch("/vote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:tok,c:c})}); let d=await r.json(); document.getElementById("out").innerText=d.message; if(d.ok){setTimeout(function(){location.href="/success?c="+c},600)} }+LT+/script+GT;
res.send(html);
});

app.post('/vote',function(req,res){
let t=req.body.token;let c=req.body.c;
if(!t||!c){return res.json({message:'Missing',ok:false})}
if(!(t in tokens)){return res.json({message:'Invalid',ok:false})}
if(usedTokens.has(t)){return res.json({message:'Used',ok:false})}
if(!(c in votes)){return res.json({message:'Invalid candidate',ok:false})}
votes[c];total;usedTokens.add(t);
res.json({message:'Voted '+c,ok:true});
});

app.get('/results',function(req,res){
let html=LT+style+GT+body{margin:0;font-family:Arial;background:linear-gradient(135deg,#8a7cff,#6a4bff);min-height:100vh;padding:18px}.h1{color:#fff;font-size:32px;font-weight:900}.blue{color:#6dc2ff}.card-purple{background:linear-gradient(90deg,#4a1fb5,#7a3bff);border-radius:26px;padding:20px;color:#fff;display:flex;justify-content:space-between;max-width:420px;margin:0 auto 16px}.big{font-size:48px;font-weight:900}.card-dark{background:#0f1e33;border-radius:26px;padding:18px;max-width:420px;margin:0 auto 14px;color:#fff}.row{display:flex;justify-content:space-between}.bar{height:10px;background:#1e2e4a;border-radius:10px;margin:10px 0}.fill{height:100%;border-radius:10px}+LT+/style+GT+LT+div class=h1+GT+Major+LT+span class=blue+GT+Tech+LT+/span+GT+Live Results+LT+/div+GT+LT+div class=card-purple+GT+LT+div+GT+TOTAL VOTES+LT+div class=big id=total+GT+0+LT+/div+GT+LT+/div+GT+LT+div+GT+IN PROGRESS+LT+/div+GT+LT+/div+GT+LT+div class=card-dark+GT+Candidate A+LT+span id=pA+GT+0%+LT+/span+GT+LT+div class=bar+GT+LT+div class=fill id=fA style=width:0%;background:#2ec4ff+GT+LT+/div+GT+LT+div id=vA+GT+0 VOTES+LT+/div+GT+LT+/div+GT+LT+div class=card-dark+GT+Candidate B+LT+span id=pB+GT+0%+LT+/span+GT+LT+div class=bar+GT+LT+div class=fill id=fB style=width:0%;background:#a98bff+GT+LT+/div+GT+LT+div id=vB+GT+0 VOTES+LT+/div+GT+LT+div class=card-dark+GT+Candidate C+LT+span id=pC+GT+0%+LT+/span+GT+LT+div class=bar+GT+LT+div class=fill id=fC style=width:0%;background:#ff7a8a+GT+LT+/div+GT+LT+/div+GT+LT+div id=vC+GT+0 VOTES+LT+/div+GT+LT+/div+GT+LT+div style=text-align:center;margin-top:12px+GT+LT+a href=/ style=color:#fff+GT+TABLE 1+LT+/a+GT+LT+/div+GT+LT+script+GT+function load(){ fetch("/api/results").then(function(r){return r.json()}).then(function(d){ let tot=d.total;document.getElementById("total").innerText=tot; let pa=0;let pb=0;let pc=0; if(tot&gt;0){pa=Math.round(d.votes.A/tot*100);pb=Math.round(d.votes.B/tot*100);pc=Math.round(d.votes.C/tot*100);} document.getElementById("pA").innerText=pa+"%";document.getElementById("pB").innerText=pb+"%";document.getElementById("pC").innerText=pc+"%"; document.getElementById("fA").style.width=pa+"%";document.getElementById("fB").style.width=pb+"%";document.getElementById("fC").style.width=pc+"%"; document.getElementById("vA").innerText=d.votes.A+" VOTES";document.getElementById("vB").innerText=d.votes.B+" VOTES";document.getElementById("vC").innerText=d.votes.C+" VOTES"; }) } load();setInterval(load,2000);+LT+/script+GT;
res.send(html);
});

app.get('/success',function(req,res){
let c=req.query.c||'A';
let html=LT+div style=background:#0f1e33;color:#fff;min-height:100vh;display:flex;justify-content:center;align-items:center;font-family:Arial+GT+LT+div style=text-align:center+GT+LT+div style=font-size:60px+GT+✓+LT+/div+GT+Vote Successful! You voted${c}+LT+br+GT+LT+a href=/results style=color:#fff+GT+View Results+LT+/a+GT+LT+/div+GT+LT+/div`+GT;
res.send(html);
});

app.get('/api/results',function(req,res){res.json({votes,total,verified,used:usedTokens.size})});
app.get('/admin/reset',function(req,res){verified={};tokens={};votes={A:0,B:0,C:0};total=0;usedTokens.clear();res.redirect('/')});
app.get('/admin',function(req,res){res.send('Admin OK - <a href=/admin/reset>Reset</a>')});
module.exports=app;
