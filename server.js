const express = require("express");
const app = express();

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const shortid = require("shortid");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", "./views");

db.defaults({ todo: [] }).write();

app.get("/", (req, res) => {
  // let q = req.query.q;
  // console.log(q);
  res.render("index.pug", {
    todos: db.get("todo").value()
  });
});

app.get("/search", (req, res) => {
  let q = req.query.q;
  let matchedTodo = db
    .get("todo")
    .value()
    .filter(item => {
      return item.title.toLowerCase().indexOf(q.toLocaleLowerCase()) !== -1;
    });
  res.render("index", {
    todos: matchedTodo
  });
});

app.get("/:id", (req, res) => {
  var id = req.params.id;
  db.get("todo")
    .remove({ id: id })
    .write();
  db.get("todo")
    .forEach((element, index) => {
      element.stt = index + 1;
    })
    .write();
  res.redirect("/");
});

app.post("/", (req, res) => {
  req.body.stt = db.get("todo").value().length + 1;
  req.body.id = shortid.generate();
  // var item = { stt: db.get("todos").value().length + 1, title: req.body.name };
  db.get("todo")
    .push(req.body)
    .write();
  res.redirect("back");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Service running on PORT:" + PORT);
});
