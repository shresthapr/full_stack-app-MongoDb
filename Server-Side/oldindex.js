"use strict";
const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const dbService = require("./olddatabaselayer");
const db = new dbService();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 4000;
const host = "localhost";
const server = http.createServer(app);

app.get("/getall", (req, res) => {
  const result = db.getAll();
  result
    .then((data) => res.json({ abcd: data }))
    .catch((err) => console.log(err));
});

app.post("/insert", async (req, res) => {
  const { Note } = req.body;
  const result = db.insertNew(Note);
  result
    .then((data) => res.json({ abcd: data }))
    .catch((err) => console.log(err));
});

app.get("/search/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await db.search(id));
});

app.delete("/remove/:id", (req, res) => {
  const { id } = req.params;
  const result = db.remove(id);
  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

app.patch("/update", (req, res) => {
  const { id, note } = req.body;
  const result = db.updatelist(id, note);
  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

server.listen(port, host, () =>
  console.log(`server ${host} Listening to ${port}`)
);
