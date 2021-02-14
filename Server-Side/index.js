"use strict";

const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const dbService = require("./databaselayer");
const db = new dbService();
app.use(cors());

const port = 4000;
const host = "localhost";
const server = http.createServer(app);

app.get("/getall", async (req, res) => {
  res.json(await db.getAll());
});

app.get("/search/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await db.search(id));
});

app.delete("/remove/:id", (req, res) => {
  const { id } = req.params;
  const result = db.remove(id);

  result.then((data) => res.json({ success: data }));
});

app.patch("/update", (req, res) => {
  console.log(req.body);
  const { Id, Note } = req.body;
  const result = db.updatelist(Id, Note);
  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});
server.listen(port, host, () =>
  console.log(`server ${host} Listening to ${port}`)
);
