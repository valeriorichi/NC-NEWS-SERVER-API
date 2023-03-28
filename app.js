const express = require("express");
const { getAllTopics, getArticleById } = require("./controllers/ncNews.controller");

const app = express();

app.use(express.json());

app.get("/api/", (req, res) => {
  res.status(200).send({ msg: "NC-NEWS Server is up and running..." })
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

// handling with a route that does not exist

app.use("/*", (req, res, next) => {
    res.status(404).send({ msg: 'Invalid path entered. Please check your URL and try again.'});
  });


// handling with other errors 
app.use((err, req, res, next) => {
    if (err.status && err.msg) res.status(err.status).send({ msg: err.msg});
    if (err.status === 404) {   res.status(404).send({ msg: 'Requested information not found!'});
    } else { 
    res.status(500).send({ msg: 'Ooops! Internal Server Error!' });
    }
});

module.exports = app;
