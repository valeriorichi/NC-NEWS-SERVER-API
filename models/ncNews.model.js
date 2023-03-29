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

exports.fetchAllArticles = () => {
  return db
  .query(
    `
    SELECT 
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
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

exports.fetchCommentsByArticleId = (article_id) => {
  return db
  .query(
    `
    SELECT *
    FROM comments
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC;
    `, [article_id]
  )
  .then((result) => {
    if (!result.rows.length) {
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
            return Promise.reject({status: 204})}
        })
    } else {
    return result.rows;
    }
  })
};

exports.insertCommentsByArticleId = (article_id, commentToPost) => {
  const {username, body} = commentToPost
  return db
  .query(
    `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `, [username, body, article_id]
  ).then((postedComment) => {
    return postedComment.rows[0];
  })
};



