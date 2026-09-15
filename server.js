const express=require('express');
const app=express();
app.get('/',(req,res)=>{
res.send("\x3ch1\x3eMajorTech TABLE 1 LIVE\x3c/h1\x3e\x3cp\x3eTest OK - Vercel working\x3c/p\x3e");
});
app.get('/api/results',(req,res)=>{
res.json({votes:{A:0,B:0,C:0},total:0});
});
module.exports=app;
