const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");

const app = express();

app.use(express.json());

app.get("/api/", (req, res) => {
  res.status(200).send({ msg: "NC-NEWS Server is up and running..." })
});

app.get("/api/topics", getAllTopics);

// handling with a route that does not exist

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// handling with other errors 
app.use((err, req, res, next) => {
    if (err.status === 404) {   
    res.status(404).send({ msg: 'Sorry we can’t find that page! Don’t worry, though everything is STILL AWESOME!'});
    } else { 
    res.status(500).send({ msg: 'Ooops! Internal Server Error!' });
    }
});




module.exports = app;
