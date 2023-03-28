const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db
  .query(
    `
      SELECT * FROM topics;
  `
  )
  .then((result) => {
    return result.rows;
  })
};

exports.fetchArticleById = (article_id) => {
    return db
    .query(
      `
        SELECT * FROM articles WHERE article_id = $1;
    `, [article_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({status: 404})
      } else {
      return result.rows[0];
      }
    })
};