const express = require('express');
const app = express();
app.get('/', (req,res)=> res.send('<h1>SERVER IS FIXED!</h1><a href="/table1">Go Table1</a>'));
app.get('/table1', (req,res)=> res.send('<h1>TABLE 1 WORKS!</h1>'));
app.get('/table2', (req,res)=> res.send('<h1>TABLE 2 WORKS!</h1>'));
app.get('/dashboard', (req,res)=> res.send('<h1>DASHBOARD WORKS!</h1>'));
module.exports = app;
