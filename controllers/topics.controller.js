const {
    fetchAllTopics } = require("../models/topics.model");
  
  exports.getAllTopics = (req, res, next) => {
    
    return fetchAllTopics()
      .then((topics) => {
        res.status(200).send({ topics });
      })
      .catch((err) => {
        console.log(err);
      });
  };