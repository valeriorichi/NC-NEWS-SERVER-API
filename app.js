const express = require("express");
const { getAllTopics, getArticleById } = require("./controllers/ncNews.controller");
const { handleInvalidPath, handleCustomErrors, handle404Status, handle500Status, handlePSQL400s } = require("./errorHandlingControllers");
const app = express();

app.use(express.json());

app.get("/api/", (req, res) => {
  res.status(200).send({ msg: "NC-NEWS Server is up and running..." })
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use("/*", handleInvalidPath);
app.use(handleCustomErrors);
app.use(handlePSQL400s);
app.use(handle404Status);
app.use(handle500Status);



module.exports = app;
