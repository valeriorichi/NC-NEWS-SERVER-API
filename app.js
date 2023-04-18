const {
  getAllTopics, getAllArticles,
  getArticleById, getCommentsByArticleId,
  postCommentsByArticleId, patchVotesByArticleById,
  removeCommentById, getAllUsers
} = require("./controllers/ncNews.controller");
const {
  handleInvalidPath, handleCustomErrors,
  handle204Status, handle404Status,
  handle500Status, handlePSQLs,
} = require("./errorHandlingControllers");

const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/", (req, res) => {
  res.status(200).send({ msg: "NC-NEWS Server is up and running..." });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.patch("/api/articles/:article_id", patchVotesByArticleById);

app.delete("/api/comments/:comment_id", removeCommentById);

app.use("/*", handleInvalidPath);
app.use(handlePSQLs);
app.use(handle204Status);
app.use(handle404Status);
app.use(handleCustomErrors);
app.use(handle500Status);



module.exports = app;
