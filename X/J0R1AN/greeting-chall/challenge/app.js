const express = require('express');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.urlencoded());

app.use((req, res, next) => {
  res.set("X-Frame-Options", "DENY");
  res.set("X-Content-Type-Options", "nosniff");
  next();
});

app.get('/dashboard', (req, res) => {
  if (!req.cookies.name) {
    return res.redirect("/");
  }
  const nonce = crypto.randomBytes(16).toString('hex');
  res.send(`
    <meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${nonce}'">
    <h1>Dashboard</h1>
    <p id="greeting"></p>
    <script nonce="${nonce}">
      fetch("/profile").then(r => r.json()).then(data => {
        if (data.name) {
          document.getElementById('greeting').innerHTML = \`Hello, <b>\${data.name}</b>!\`;
        }
      })
    </script>
  `);
});
app.get("/", (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="post">
      <input type="text" name="name" placeholder="Enter your name" required autofocus>
      <button type="submit">Login</button>
    </form>
  `);
});
app.post("/login", (req, res) => {
  res.cookie("name", String(req.body.name));
  res.redirect("/dashboard");
});
app.get("/profile", (req, res) => {
  res.json({
    name: String(req.cookies.name),
  })
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Listening at http://localhost:${port}`)
});
