const {
        fetchAllTopics, fetchAllArticles,
        fetchArticleById, fetchCommentsByArticleId,
        insertCommentsByArticleId, updateVotesByArticleId,
        deleteCommentById, fetchAllUsers } = require("../models/ncNews.model");
  
exports.getAllTopics = (req, res, next) => {
  return fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const allowedKeys = ['topic', 'sort_by', 'order'];
  if (
    !Object.keys(req.query).every((key) => allowedKeys.includes(key))
  ) { throw { code: "23400" } };
  const { topic, sort_by, order } = req.query;
  
  return fetchAllArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const commentToPost = req.body;
  return insertCommentsByArticleId(article_id, commentToPost)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesByArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return updateVotesByArticleId(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  return deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (req, res, next) => {
  return fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};



