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

exports.fetchAllArticles = (topic, sort_by = 'created_at', order = 'desc' ) => {
  const articlesTable = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'comment_count'];
  if (!articlesTable.includes(sort_by)) return Promise.reject({ code: "23400" });
  let query =
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
        `;

  if (topic) query = query + ` WHERE articles.topic = '${topic}'`;
  
  query = query + `
    GROUP BY articles.article_id
    ORDER BY articles.${sort_by} ${order};
  `;
  return db
    .query(query)
    .then((result) => {
      
      if (!result.rows.length) {
        return db
          .query(
            `
            SELECT * FROM topics WHERE slug = $1;
          `, [topic]
          )
          .then((result) => {
            if (!result.rows.length) {
              return Promise.reject({status: 404});
            } else {
              return Promise.reject({status: 204, msg: `No article with slug: ${topic}`});
            }
          });
      } else {
         return result.rows;
      }
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
      SELECT articles.*,
      CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
      `, [parseInt(article_id)])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404 });
      } else {
        return result.rows[0];
      }
    });
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
              return Promise.reject({status: 204, msg: 'No comments found for this article!'})}
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
      `, [username, body, article_id])
    .then((postedComment) => {
      return postedComment.rows[0];
    })
};

exports.updateVotesByArticleId = (article_id, inc_votes) => {
  return db
      .query(
        `
        SELECT * FROM articles WHERE article_id = $1;
        `, [article_id]
      )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({code:'23503', detail: 'no articles with such id'})
      } else {
        const updatedVotes = result.rows[0].votes + inc_votes;
          return db
            .query(
              `
              UPDATE articles
              SET votes = $1
              WHERE article_id = $2
              RETURNING *;
              `, [updatedVotes, article_id])
            .then((result) => {
              return result.rows[0];
            });
      }
  });
};

exports.deleteCommentById = (comment_id) => {
  return db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `, [comment_id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404 });
      }
    });
};

exports.fetchAllUsers = () => {
  return db
    .query(
      `
      SELECT * FROM users;
      `
    )
    .then((result) => {
      return result.rows;
    })
};



