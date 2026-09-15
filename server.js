app.get('/admin', (req, res) => {
  res.send(`
  <style>body{font-family:Arial;padding:20px;background:#0f1e33;color:#fff} .card{background:#1a2b4a;padding:20px;border-radius:16px;max-width:600px;margin:auto} button{padding:12px 20px;border:none;border-radius:10px;font-weight:800;cursor:pointer} .danger{background:#ff3b3b;color:#fff}</style>
  <div class="card"><h2>MajorTech Admin</h2>
  <div id="d">Loading...</div><br>
  <button onclick="location.href='/admin/reset'" class="danger">RESET ALL VOTES & TOKENS</button>
  <button onclick="location.href='/results'" style="background:#7a3bff;color:#fff;margin-left:8px">View Results</button>
  <button onclick="location.href='/'" style="background:#fff;color:#000;margin-left:8px">Table 1</button>
  </div>
  <script>
  fetch("/api/results").then(r=>r.json()).then(d=>{
    let h="<b>Total Votes:</b> "+d.total+"<br><b>Used Tokens:</b> "+(d.used||0)+"<br><hr><b>Votes:</b><br>";
    for(let k in d.votes){h+=k+": "+d.votes[k]+"<br>"}
    h+="<hr><b>Verified IDs:</b><br>";
    if(d.verified){for(let k in d.verified){h+=k+" => "+d.verified[k]+"<br>"}}
    document.getElementById("d").innerHTML=h;
  })
  </script>`);
});
