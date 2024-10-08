const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 2000;

app.use(express.static("public"));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const fs = require("node:fs");

app.get("/", (req, res) => {
  let html = fs.readFileSync("./data/index.html", "utf8");

  res.send(html);
});

app.get("/hard", (req, res) => {
  let html = fs.readFileSync("./data/playground.html", "utf8");
  html = html.replace("{{JS}}", "hard.js").replace("{{MODE}}", "medium");

  res.send(html);
});

app.get("/easy", (req, res) => {
  let html = fs.readFileSync("./data/playground.html", "utf8");

  html = html.replace("{{JS}}", "easy.js").replace("{{MODE}}", "easy");

  res.send(html);
});

app.get("/medium", (req, res) => {
  let html = fs.readFileSync("./data/playground.html", "utf8");

  html = html.replace("{{JS}}", "medium.js").replace("{{MODE}}", "medium");

  res.send(html);
});

app.listen(port, (_) => {
  console.log(`Battleship app listening on port ${port}`);
});
