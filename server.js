const express = require('express');
const app = express();
app.use(express.json());
let votes={"Candidate A":0,"Candidate B":0,"Candidate C":0};
let total=0;
let voted=new Set();
function b64(s){return Buffer.from(s,'base64').toString();}
app.get('/',(req,res)=>{
let html=b64('PCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCxp bml0aWFsLXNjYWxlPTEiPjxzdHlsZT5ib2R5e2ZvbnQtZmFtaWx5OkFyaWFsO2JhY2tncm91bmQ6I2YwZTZmZjt0ZXh0LWFsaWduOmNlbnRlcjtwYWRkaW5nOjIwcHh9LmJveHtiYWNrZ3JvdW5kOiNmZmY7bWF4LXdpZHRoOjQwMHB4O21hcmdpbjphdXRvO3BhZGRpbmc6MjBweDtib3JkZXItcmFkaXVzOjE2cHh9aDF7Y29sb3I6IzZhMDBmZn1idXR0b257d2lkdGg6MTAwJTtwYWRkaW5nOjE0cHg7bWFyZ2luOjhweCAwO2JhY2tncm91bmQ6IzZhMDBmZjtjb2xvcjojZmO2JvcmRlcjpub25lO2JvcmRlci1yYWRpdXM6MTBweDtmb250LXdlaWdodDpib2xkfTwvc3R5bGU+PC9oZWFkPjxib2R5PjxoMT5NYWpvclRlY2ggLSBUQUJMRSAxPC9oMT48ZGl2IGNsYXNzPSJib3giPjxoMj5Wb3RlPC9oMj48YnV0dG9uIG9uY2xpY2s9InYoJ0EnKSI+Q2FuZGlkYXRlIEE8L2J1dHRvbj48YnV0dG9uIG9uY2xpY2s9InYoJ0InKSI+Q2FuZGlkYXRlIEI8L2J1dHRvbj48YnV0dG9uIG9uY2xpY2s9InYoJ0MnKSI+Q2FuZGlkYXRlIEM8L2J1dHRvbj48ZGl2IGlkPSJtIj48L2Rpdj48cD48YSBocmVmPSIvcmVzdWx0cyI+UmVzdWx0czwvYT4gfCA8YSBocmVmPSIvYWRtaW4iPkFkbWluPC9hPjwv cD48L2Rpdj48c2NyaXB0PmFzeW5jIGZ1bmN0aW9uIHYoYyl7bGV0IHI9YXdhaXQgZmV0Y2goJy92b3RlJyx7bWV0aG9kOidQT1NUJyx oZWFkZXJzOnsnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbid9LGJvZHk6SlNPTi5zdHJpbmdpZnkoe2NhbmRpZGF0ZTpjfSl9KTtsZXQgZD1hd2FpdCByLmpzb24oKTttLmlubmVyVGV4dD1kLm1lc3NhZ2V9PC9zY3JpcHQ+PC9ib2R5PjwvaHRtbD4=');
res.send(html);
});
app.get('/results',(req,res)=>res.send('<h1>Results</h1><div id="b">Loading</div><script>async function l(){let r=await fetch("/api/results");let d=await r.json();let h="Total:"+d.total+"<br>";for(let k in d.votes)h+=k+":"+d.votes[k]+"<br>";b.innerHTML=h}l();setInterval(l,3000)</script><a href="/">Back</a>'));
app.get('/admin',(req,res)=>res.send('<h1>Admin</h1><input id="u" placeholder="user"><input id="p" type="password" placeholder="pass"><button onclick="login()">Login</button><div id="msg"></div><script>async function login(){let r=await fetch("/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:u.value,password:p.value})});let d=await r.json();if(d.ok)location.href="/admin/dashboard";else msg.innerText=d.message}</script>'));
app.get('/admin/dashboard',(req,res)=>res.send('<h1>Dashboard</h1><div id="d"></div><a href="/admin/reset">Reset</a> | <a href="/">Home</a><script>async function l(){let r=await fetch("/api/results");let d=await r.json();document.getElementById("d").innerHTML="Total:"+d.total+" A:"+d.votes["Candidate A"]+" B:"+d.votes["Candidate B"]+" C:"+d.votes["Candidate C"]}l()</script>'));
app.get('/admin/reset',(req,res)=>{votes={"Candidate A":0,"Candidate B":0,"Candidate C":0};total=0;voted.clear();res.redirect('/admin/dashboard');});
app.post('/vote',(req,res)=>{let ip=req.headers["x-forwarded-for"]||req.socket.remoteAddress;if(voted.has(ip))return res.json({message:"Already voted"});let c=req.body.candidate;let map={"A":"Candidate A","B":"Candidate B","C":"Candidate C"};let real=map[c]||c;if(votes[real]!undefined){votes[real];total;voted.add(ip);return res.json({message:"Voted "+real})}res.json({message:"Invalid"});});
app.post('/admin/login',(req,res)=>{if(req.body.username="admin"&&req.body.password==="majortech123")return res.json({ok:true});res.json({ok:false,message:"Wrong"});});
app.get('/api/results',(req,res)=>res.json({votes,total}));
module.exports=app;
