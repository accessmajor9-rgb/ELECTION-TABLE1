const express=require('express');
const app=express();
app.use(express.json());
let verified={};
let tokens={};
app.get('/',function(req,res){
let L=String.fromCharCode(60);
let R=String.fromCharCode(62);
let h=L+'style'+R+'*{box-sizing:border-box}body{margin:0;font-family:Arial;background:linear-gradient(135deg,#7b8cff,#5e2cff 70%,#4a1ac7);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:420px;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.3)}.top{background:#0a1931;padding:26px 24px 22px}.pill{display:inline-block;border:1px solid rgba(255,255,255,.25);color:#cbd5e1;font-size:11px;letter-spacing:1px;padding:8px 14px;border-radius:20px;background:rgba(255,255,255,.08)}.title{margin:18px 0 6px;color:#fff;font-size:34px;font-weight:800;line-height:1}.blue{color:#5fa8ff}.sub{color:#8aa0c6;font-size:14px;line-height:1.3}.bottom{padding:28px 22px 16px}.label{color:#5b6b86;font-size:12px;letter-spacing:1.5px;font-weight:700;margin-bottom:10px}input{width:100%;padding:18px 18px;border:2px solid #e2e8f0;border-radius:18px;font-size:16px;outline:none}input:focus{border-color:#5e2cff}button.verify{width:100%;margin-top:16px;padding:18px;background:#0a1931;color:#fff;border:none;border-radius:18px;font-size:16px;font-weight:800;letter-spacing:1px} #out{margin-top:18px;padding:16px;border-radius:16px;background:#f0f5ff;display:none}.token{font-size:32px;font-weight:900;letter-spacing:4px;color:#0a1931}.foot{display:flex;justify-content:space-between;padding:14px 22px;background:#f8fafc;color:#9aa9c0;font-size:10px;letter-spacing:1px}'+L+'/style'+R;
h+=L+'div class=card'+R+L+'div class=top'+R+L+'div class=pill'+R+'TABLE 1 | VERIFICATION DESK | MAJORTECH OS'+L+'/div'+R;
h+=L+'div class=title'+R+'Major'+L+'span class=blue'+R+'Tech'+L+'/span'+R+' Verify'+L+'/div'+R;
h+=L+'div class=sub'+R+'Liberia Institute | Official Student ID<br>Verification and Token Engine'+L+'/div'+R+L+'/div'+R;
h+=L+'div class=bottom'+R+L+'div class=label'+R+'ENTER STUDENT ID NUMBER'+L+'/div'+R;
h+=L+'input id=sid placeholder="e.g. LISE-037-2025"'+R;
h+=L+'button class=verify onclick=doVerify()'+R+'VERIFY '+L+'span'+R+'>'+L+'/span'+R+L+'/button'+R;
h+=L+'div id=out'+R+L+'div style=font-size:12px;color:#5b6b86'+R+'VERIFIED - YOUR 6-DIGIT TOKEN'+L+'/div'+R+L+'div id=tok class=token'+R+''+L+'/div'+R+L+'div id=sidout style=font-size:13px;margin-top:6px'+R+''+L+'/div'+R+L+'div style=margin-top:12px'+R+L+'a href=/results'+R+'View All Verified'+L+'/a'+R+' | '+L+'a href=/admin'+R+'Admin'+L+'/a'+R+L+'/div'+R+L+'/div'+R+L+'/div'+R;
h+=L+'div class=foot'+R+L+'span'+R+'SECURE | ENCRYPTED'+L+'/span'+R+L+'span'+R+'POWERED BY MAJORTECH'+L+'/span'+R+L+'/div'+R+L+'/div'+R;
h+=L+'script'+R+'async function doVerify(){let i=document.getElementById("sid");let id=i.value.trim();if(!id||id.length<3){alert("Enter ID");return}let r=await fetch("/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sid:id})});let d=await r.json();if(d.ok){let o=document.getElementById("out");o.style.display="block";document.getElementById("tok").innerText=d.token;document.getElementById("sidout").innerText="ID: "+id+" - Use this token in TABLE 2"}else{document.getElementById("out").style.display="block";document.getElementById("out").innerHTML="<span style=color:red>"+d.msg+"<"+"/span>"}}'+L+'/script'+R;
res.send(h);
});
app.post('/verify',function(req,res){
let sid=req.body.sid;
if(!sid){return res.json({ok:false,msg:'ID required'})}
sid=sid.trim().toUpperCase();
if(sid.length<5){return res.json({ok:false,msg:'Invalid ID format'})}
if(sid in verified){let t=verified[sid];return res.json({ok:true,token:t,msg:'Already verified'})}
let tok=Math.floor(100000+Math.random()*900000);
tok=tok.toString();
verified[sid]=tok;
tokens[tok]=sid;
res.json({ok:true,token:tok});
});
app.get('/results',function(req,res){
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
let rows='';
for(let k in verified){rows+=k+': '+verified[k]+'<br>'}
if(!rows){rows='No verifications yet'}
res.send(L+'h2'+R+'TABLE 1 - Verified IDs'+L+'/h2'+R+rows+L+'<br><a href=/'+R+'Back'+L+'/a'+R);
});
app.get('/api/tokens',function(req,res){res.json({verified,tokens})});
app.get('/admin',function(req,res){let L=String.fromCharCode(60);let R=String.fromCharCode(62);res.send(L+'h1'+R+'Admin'+L+'/h1'+R+L+'a href=/admin/dashboard'+R+'Dashboard'+L+'/a'+R)});
app.get('/admin/dashboard',function(req,res){
let L=String.fromCharCode(60);let R=String.fromCharCode(62);
let html=L+'h1'+R+'TABLE 1 Dashboard'+L+'/h1'+R+'<div id=d>Loading</div>'+L+'script'+R+'fetch("/api/tokens").then(function(r){return r.json()}).then(function(d){let h="";for(let k in d.verified){h+=k+" => "+d.verified[k]+"<br>"}if(!h)h="Empty";document.getElementById("d").innerHTML=h})'+L+'/script'+R+L+'br'+R+L+'a href=/admin/reset'+R+'Reset All'+L+'/a'+R;
res.send(html);
});
app.get('/admin/reset',function(req,res){verified={};tokens={};res.redirect('/')});
module.exports=app;
