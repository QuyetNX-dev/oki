const express = require("express");
const app = express();

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

app.set("view engine", "pug");
app.set("views", "./views");

db.defaults({ todo: [] });

app.get("/", (req, res) => {
  res.render("index.pug");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Service running on PORT:" + PORT);
});
