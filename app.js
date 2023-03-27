const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");

const app = express();

app.get("/api/", (req, res) => {
  res.status(200).send({ msg: "NC-NEWS Server is up and running..." });
});

app.get("/api/topics", getAllTopics);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

module.exports = app;
