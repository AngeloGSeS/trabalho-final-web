const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.use('/css', express.static(path.join(__dirname, "..", "css")));
app.use('/publico', express.static(path.join(__dirname, "..", "publico")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "admin", "login.html"));
});

app.post("/admin/login", (req, res) => {
  const { email, senha } = req.body;

  if (email && senha) {
    res.sendFile(path.join(__dirname, "..", "admin", "index.html"));
  } else {
    res.send("Login inválido! Preencha todos os campos.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
