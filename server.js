const express = require('express');
const app = express();
const PORT = 3000;
const ADMIN_PASS = 'MajorTech2025';
app.use(express.urlencoded({extended:true}));
app.use(express.json());

let votes = { 'Candidate A':0, 'Candidate B':0, 'Candidate C':0 };
let votedList = [];
let tokens = {};

function pageWrap(body){
return "\x3chtml\x3e\x3chead\x3e\x3cmeta name='viewport' content='width=device-width,initial-scale=1'\x3e\x3cstyle\x3ebody{margin:0;font-family:sans-serif;background:linear-gradient(135deg,#7da8ff 0%,#7e6bff 50%,#1a2a4a 100%);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.card{width:100%;max-width:380px;background:#0f172a;border-radius:30px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.4)}.card-header{padding:28px 24px;background:linear-gradient(135deg,#0f172a,#1e3a8a)}.badge{font-size:10px;letter-spacing:1px;background:rgba(255,255,255,.1);padding:8px 14px;border-radius:20px;color:#fff;display:inline-block;border:1px solid rgba(255,255,255,.2)}.logo{font-size:32px;font-weight:800;color:white;margin:14px 0 6px}.logo span{color:#60a5fa}.sub{color:#94a3b8;font-size:13px}.card-body{background:white;padding:24px}.label{font-size:11px;letter-spacing:1px;color:#64748b;font-weight:700;margin-bottom:10px} input{width:100%;padding:18px;border-radius:18px;border:1.5px solid #e2e8f0;font-size:16px;box-sizing:border-box;outline:none}.btn{width:100%;padding:18px;border-radius:18px;border:none;background:#0f172a;color:white;font-weight:800;font-size:15px;margin-top:16px;cursor:pointer}.btn-purple{background:#4f46e5}.token-box{background:#fef08a;padding:16px;border-radius:14px;text-align:center;font-weight:800;font-size:20px;letter-spacing:1px;border:2px dashed #000;margin:12px 0}.footer{display:flex;justify-content:space-between;padding:14px 20px;background:#f8fafc;font-size:9px;color:#94a3b8;letter-spacing:.5px}\x3c/style\x3e\x3c/head\x3e\x3cbody\x3e"+body+"\x3c/body\x3e\x3c/html\x3e";
}

app.get('/', function(req,res){
let body = "\x3cdiv class='card'\x3e\x3cdiv class='card-header'\x3e\x3cdiv class='badge'\x3eTABLE 1 | VERIFICATION DESK | MAJORTECH OS\x3c/div\x3e\x3cdiv class='logo'\x3eMajor\x3cspan\x3eTech\x3c/span\x3e Verify\x3c/div\x3e\x3cdiv class='sub'\x3eLiberia Institute | Official Student ID Verification & Token Engine\x3c/div\x3e\x3c/div\x3e\x3cdiv class='card-body'\x3e\x3cdiv class='label'\x3eENTER STUDENT ID NUMBER\x3c/div\x3e\x3cform action='/generate-token' method='post'\x3e\x3cinput name='id' placeholder='e.g. LISE-037-2025' required\x3e\x3cbutton class='btn'\x3eVERIFY >\x3c/button\x3e\x3c/form\x3e\x3c/div\x3e\x3cdiv class='footer'\x3e\x3cspan\x3eSECURE | ENCRYPTED\x3c/span\x3e\x3cspan\x3ePOWERED BY MAJORTECH\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e";
res.send(pageWrap(body));
});

app.post('/generate-token', function(req,res){
let id = req.body.id.trim();
let already = votedList.includes(id);
if(already == true){
let body="\x3cdiv class='card'\x3e\x3cdiv class='card-body' style='text-align:center;padding:40px'\x3e\x3ch2\x3eID "+id+" Already Voted\x3c/h2\x3e\x3ca href='/'\x3eBack\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e";
return res.send(pageWrap(body));
}
let token = 'MTECH-'+Math.random().toString(36).substring(2,6).toUpperCase()+'-'+Math.random().toString(36).substring(2,6).toUpperCase();
tokens[token]={voterId:id,used:false};
let body="\x3cdiv class='card'\x3e\x3cdiv class='card-header'\x3e\x3cdiv class='badge'\x3eTOKEN GENERATED | SECURE\x3c/div\x3e\x3cdiv class='logo'\x3eToken \x3cspan\x3eReady\x3c/span\x3e\x3c/div\x3e\x3cdiv class='sub'\x3eID: "+id+" Verified\x3c/div\x3e\x3c/div\x3e\x3cdiv class='card-body'\x3e\x3cdiv class='label'\x3eYOUR VOTING TOKEN FROM TABLE 1\x3c/div\x3e\x3cdiv class='token-box'\x3e"+token+"\x3c/div\x3e\x3cp style='font-size:12px;color:#64748b;text-align:center'\x3eLong press to copy\x3c/p\x3e\x3ca href='/vote?token="+token+"'\x3e\x3cbutton class='btn btn-purple'\x3eNEXT - GO TO BALLOT\x3c/button\x3e\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e";
res.send(pageWrap(body));
});

app.get('/vote', function(req,res){
let t=req.query.token||'';
let body="\x3cdiv class='card'\x3e\x3cdiv class='card-header'\x3e\x3cdiv class='logo'\x3eMajor\x3cspan\x3eTech\x3c/span\x3e Ballot\x3c/div\x3e\x3cdiv class='badge'\x3eTABLE 2 | SECURE BALLOT | MAJORTECH OS\x3c/div\x3e\x3c/div\x3e\x3cdiv class='card-body'\x3e\x3cdiv class='label'\x3eENTER VOTING TOKEN FROM TABLE 1\x3c/div\x3e\x3cform action='/ballot' method='post'\x3e\x3cinput name='token' value='"+t+"' placeholder='MTECH-XXXX-XXXX' required\x3e\x3cbutton class='btn btn-purple'\x3eUNLOCK >\x3c/button\x3e\x3c/form\x3e\x3c/div\x3e\x3c/div\x3e";
res.send(pageWrap(body));
});

app.post('/ballot', function(req,res){
let token=req.body.token.trim();
let data=tokens[token];
if(data == null){
let b="\x3cdiv class='card'\x3e\x3cdiv class='card-body' style='text-align:center;padding:40px'\x3e\x3ch2\x3eInvalid Token\x3c/h2\x3e\x3ca href='/'\x3eBack to TABLE 1\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e";
return res.send(pageWrap(b));
}
if(data.used == true){
let b="\x3cdiv class='card'\x3e\x3cdiv class='card-body' style='text-align:center;padding:40px'\x3e\x3ch2\x3eToken Already Burned\x3c/h2\x3e\x3c/div\x3e\x3c/div\x3e";
return res.send(pageWrap(b));
}
let body="\x3cdiv class='card'\x3e\x3cdiv class='card-header'\x3e\x3cdiv class='badge'\x3eVOTING NOW | ID: "+data.voterId+"\x3c/div\x3e\x3cdiv class='logo'\x3eChoose \x3cspan\x3eCandidate\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class='card-body'\x3e\x3cform action='/cast-vote' method='post'\x3e\x3cinput type='hidden' name='token' value='"+token+"'\x3e\x3cdiv class='label'\x3ePRESIDENT - SELECT ONE\x3c/div\x3e\x3clabel style='display:block;padding:14px;border:1.5px solid #e2e8f0;border-radius:14px;margin-bottom:10px'\x3e\x3cinput type='radio' name='President' value='Candidate A' required\x3e Candidate A - Change Maker\x3c/label\x3e\x3clabel style='display:block;padding:14px;border:1.5px solid #e2e8f0;border-radius:14px;margin-bottom:10px'\x3e\x3cinput type='radio' name='President' value='Candidate B' required\x3e Candidate B - Unity First\x3c/label\x3e\x3clabel style='display:block;padding:14px;border:1.5px solid #e2e8f0;border-radius:14px;margin-bottom:10px'\x3e\x3cinput type='radio' name='President' value='Candidate C' required\x3e Candidate C - New Vision\x3c/label\x3e\x3cbutton class='btn'\x3eVOTE NOW - BURN TOKEN\x3c/button\x3e\x3c/form\x3e\x3c/div\x3e\x3c/div\x3e";
res.send(pageWrap(body));
});

app.post('/cast-vote', function(req,res){
let token=req.body.token;
let data=tokens[token];
if(data == null){return res.send("Invalid");}
if(data.used == true){return res.send("Burned");}
votedList.push(data.voterId);
tokens[token].used=true;
let chosen = req.body.President || 'Candidate A';
votes[chosen]=(votes[chosen]||0)+1;
let body="\x3cdiv class='card'\x3e\x3cdiv class='card-body' style='text-align:center;padding:40px 24px'\x3e\x3cdiv style='width:80px;height:80px;background:#22c55e;border-radius:50%;display:flex;justify-content:center;align-items:center;margin:0 auto 16px;color:white;font-size:40px'\x3e✓\x3c/div\x3e\x3ch2\x3eVOTE SEALED\x3c/h2\x3e\x3cp style='color:#64748b;font-size:12px'\x3eToken burned. One person one vote enforced by MajorTech.\x3c/p\x3e\x3ch3\x3eYou voted for "+chosen+"\x3c/h3\x3e\x3ca href='/'\x3e\x3cbutton class='btn'\x3eNEXT VOTER >\x3c/button\x3e\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e";
res.send(pageWrap(body));
});

app.get('/dashboard', function(req,res){
let pass = req.query.pass;
if(pass == ADMIN_PASS){
let total = votes['Candidate A']+votes['Candidate B']+votes['Candidate C'];
let body = "\x3cdiv style='width:100%;max-width:420px'\x3e\x3ch1 style='color:white;font-size:34px;font-weight:800'\x3eMajor\x3cspan style='color:#60a5fa'\x3eTech\x3c/span\x3e\x3cbr\x3eLive Results\x3c/h1\x3e\x3cdiv style='background:linear-gradient(135deg,#3b2aa0,#6d28d9);border-radius:24px;padding:20px;color:white;margin:20px 0'\x3e\x3cdiv style='font-size:11px'\x3eTOTAL VOTES CAST\x3c/div\x3e\x3cdiv style='display:flex;justify-content:space-between;align-items:center'\x3e\x3cdiv style='font-size:48px;font-weight:800'\x3e"+total+"\x3c/div\x3e\x3cdiv style='text-align:right;font-size:11px'\x3eELECTION IN PROGRESS\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e";
for(let cand in votes){
let count=votes[cand];
let pct=total>0?Math.round((count/total)*100):0;
let letter=cand.split(' ')[1];
let color = cand=='Candidate A'?'#38bdf8':cand=='Candidate B'?'#a78bfa':'#fb7185';
body+="\x3cdiv style='background:#0f172a;border-radius:24px;padding:18px;margin-bottom:14px;color:white'\x3e\x3cdiv style='display:flex;justify-content:space-between'\x3e\x3cdiv style='display:flex;gap:12px'\x3e\x3cdiv style='width:52px;height:52px;border-radius:16px;background:"+color+";display:flex;justify-content:center;align-items:center;font-weight:800'\x3e"+letter+"\x3c/div\x3e\x3cdiv\x3e\x3cdiv style='font-weight:700'\x3e"+cand+"\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style='font-size:28px;font-weight:800'\x3e"+pct+"%\x3c/div\x3e\x3c/div\x3e\x3cdiv style='background:#1e293b;height:8px;border-radius:10px;margin:14px 0'\x3e\x3cdiv style='background:"+color+";height:8px;width:"+pct+"%'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style='font-size:10px;color:#64748b'\x3e"+count+" VOTES\x3c/div\x3e\x3c/div\x3e";
}
body+="\x3c/div\x3e";
return res.send(pageWrap(body));
} else {
let body="\x3cdiv class='card'\x3e\x3cdiv class='card-body' style='padding:40px;text-align:center'\x3e\x3ch2\x3eADMIN ONLY\x3c/h2\x3e\x3cp\x3eUse /dashboard?pass=MajorTech2025\x3c/p\x3e\x3c/div\x3e\x3c/div\x3e";
return res.send(pageWrap(body));
}
});

app.get('/results', function(req,res){res.json(votes);});
app.listen(PORT,'0.0.0.0',function(){console.log('BEAUTIFUL MAJORTECH LIVE: http://10.69.1.152:'+PORT);});
