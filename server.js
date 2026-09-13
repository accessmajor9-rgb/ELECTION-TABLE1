require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MajorTech_Lib_2026_Secure!@#';
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
let votes = { "Candidate A": 0, "Candidate B": 0 };
let votedPhones = new Set();
let totalVotes = 0;
app.post('/vote', function(req, res) {
var candidate = req.body.candidate;
var phone = req.body.phone;
if (!candidate ||!phone) return res.status(400).json({ success: false, message: 'Missing data' });
if (votedPhones.has(phone)) return res.status(403).json({ success: false, message: 'This phone already voted!' });
if (!votes.hasOwnProperty(candidate)) return res.status(400).json({ success: false, message: 'Invalid candidate' });
votes[candidate] = votes[candidate] + 1;
votedPhones.add(phone);
totalVotes = totalVotes + 1;
console.log("Vote counted");
res.json({ success: true, message: 'Vote counted!', votes: votes });
});
app.get('/results', function(req, res) {
res.json({ votes: votes, totalVotes: totalVotes, votedCount: votedPhones.size });
});
app.post('/reset', function(req, res) {
var password = req.body.password;
if (password!== ADMIN_PASSWORD) return res.status(401).json({ success: false, message: 'Unauthorized!' });
for (var key in votes) votes[key] = 0;
votedPhones.clear();
totalVotes = 0;
res.json({ success: true, message: 'Election reset!' });
});
app.listen(PORT, '0.0.0.0', function() {
console.log("MajorTech Live Voting running on port " + PORT);
console.log("Server is LIVE");
});