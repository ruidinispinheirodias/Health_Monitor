const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let dadosVitais = {};

app.post("/vitais", (req, res) => {
  dadosVitais = req.body;
  console.log("Dados recebidos:", dadosVitais);
  res.status(200).json({ mensagem: "Dados recebidos com sucesso" });
});

app.get("/vitais", (req, res) => {
  res.json(dadosVitais);
});

app.get("/", (req, res) => {
  res.send("API de dados vitais em funcionamento. Utilize /vitais para interagir.");
});

app.listen(port, () => {
  console.log(`Servidor a correr em http://localhost:${port}`);
});
