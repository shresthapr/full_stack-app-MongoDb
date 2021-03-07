"use strict";
const http = require("http");
const port = 4000;
const host = "localhost";

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require("cors");
app.use(cors());

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const { Schema } = mongoose;

const myatlasDb = process.env.ATLAS_DB;
//opens a connection to database
mongoose.connect(myatlasDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mdb = mongoose.connection;
//checking connection status
mdb.on("Connected", function () {
  console.log("Mongoose default connection is now Open");
});

mdb.on("error", function (err) {
  console.log("Mongoose default connection error: " + err);
});

mdb.on("disconnected", function () {
  console.log("Mongoose default connection is Disconnected");
});

const todoSchema = new Schema({
  _id: Number,
  note: String,
  entry: { type: Date, default: Date.now },
  type: String,
  status: false,
});

//makes the model
const Todo = mongoose.model("todo", todoSchema);

const server = http.createServer(app);

app.get("/getall", (req, res) => {
  Todo.find({}, (err, todos) => {
    if (err) console.log(err);
    else res.json({ todos });
  });
});

app.get("/search/:id", async (req, res) => {
  const { id } = req.params;
  Todo.find({ _id: id }, (err, todos) => {
    if (err) console.log(err);
    else res.json({ todos });
  });
});

app.post("/insert", async (req, res) => {
  const newitem = req.params;
  console.log("this is newitem", newitem);
  const newtodo = new Todo({
    title: req.body.note,
    content: req.body.content,
  });
  newtodo.save().then(() => console.log("Succesfully saved to MongoDB"));
  res.send("Received Post");
});

// app.post("/insert", async (req, res) => {
//   const data = req.body;

//   Todo.insertOne(
//     {
//       _id: data.id,
//       note: data.note,
//       entry: data.entry,
//       type: data.type,
//       status: data.status,
//     },
//     (err, todos) => {
//       if (err) console.log(err);
//       else res.json({ todos });
//     }
//   );
// });

// app.delete("/remove/:id", async (req, res) => {
//   const { id } = req.params;
//   // try {
//   //   Todo.deleteOne({ _id: id });
//   // } catch (e) {
//   //   print(e);
//   // }
//   await todo_app_mdb
//     .collection("todos")
//     .deleteOne({ _id: `${id}` })
//     .then((result) => res.json(result))
//     .catch((err) => res.json(err));
// });

app.get("/remove/:id", async (req, res) => {
  const { id } = req.params;
  try {
    Todo.findOneAndRemove({ _id: id }, function (err, member) {
      if (!err && member) {
        console.log("member successfully deleted");
      } else {
        console.log("error");
      }
      res.redirect("/getall");
    });
  } catch (err) {
    console.log(err);
  }
});

app.patch("/update", async (req, res) => {
  const { id, note } = req.body;
  const result = await Todo.updateOne({});
});

server.listen(port, host, () =>
  console.log(`server ${host} Listening to ${port}`)
);
