const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/');
const connection = require('../db/connection');
const db = require("../db/connection");



beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
    return connection.end()
});

describe("GET /api/", () => {
  it("200: responds with an msg 'NC-NEWS Server is up and running...'", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("NC-NEWS Server is up and running...");
      });
  });
  test("GET 404: responds with error and message when requesting a non-existent endpoint", () => {
    return request(app)
      .get("/api/non-existent-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid path entered. Please check your URL and try again.');
      });
  }); 
});


describe("GET /api/topics", () => {
    test("GET 200: responds with an array of topic objects, each of which should have the following properties: slug, description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toBeInstanceOf(Array);
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String)
            });
          });
        });
    });
});


describe("GET /api/articles/:article_id", () => {
  test("GET 200: responds with article object, which should have certain properties ", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty('article_id', expect.any(Number));
        expect(body.article).toHaveProperty('title', expect.any(String));
        expect(body.article).toHaveProperty('topic', expect.any(String));
        expect(body.article).toHaveProperty('author', expect.any(String));
        expect(body.article).toHaveProperty('body', expect.any(String));
        expect(body.article).toHaveProperty('created_at');
        expect(new Date(body.article.created_at)).toEqual(expect.any(Date));
        expect(body.article).toHaveProperty('votes', expect.any(Number));
        expect(body.article).toHaveProperty('article_img_url', expect.any(String));
        expect(body.article.body).toMatch(/^Call me Mitchell/);
        expect(body.article.article_img_url).toMatch(/^https/)
      })
  });
  test("GET 404: responds with error when article with queried id does not exist ", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Requested information not found!');
      });
  });
  test("GET 400: responds with 'Invalid request...' when article id entered in wrong format", () => {
    return request(app)
      .get("/api/articles/abc")
      .expect(400)
      .then(({ res }) => {
        expect(res.statusMessage).toBe('Invalid request: not a valid integer entered!');
      });
  });
});

describe("GET /api/articles", () => {
  test("GET 200: array of article objects, each of which should have the certain properties and the articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        expect(articles).toBeSorted({ key: articles.created_at })
        articles.forEach((article) => {
          expect(article).toHaveProperty('article_id', expect.any(Number));
          expect(article).toHaveProperty('title', expect.any(String));
          expect(article).toHaveProperty('topic', expect.any(String));
          expect(article).toHaveProperty('author', expect.any(String));
          expect(article).toHaveProperty('created_at')
          expect(new Date(article.created_at)).toEqual(expect.any(Date));
          expect(article).toHaveProperty('votes', expect.any(Number));
          expect(article).toHaveProperty('article_img_url', expect.any(String), expect(article.article_img_url).toMatch(/^https/));
          expect(article).toHaveProperty('comment_count', expect.any(Number));
          });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET 200: array of comments for the given article_id of which each comment should have the certain properties and the comments should be served with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments/")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(10);
        expect(comments).toBeSorted({ key: comments.created_at })
        comments.forEach((comment) => {
          expect(comment).toHaveProperty('comment_id', expect.any(Number));
          expect(comment).toHaveProperty('body', expect.any(String));
          expect(comment).toHaveProperty('votes', expect.any(Number));
          expect(comment).toHaveProperty('author', expect.any(String));
          expect(comment).toHaveProperty('article_id', expect.any(Number));
          expect(comment).toHaveProperty('created_at')
          expect(new Date(comment.created_at)).toEqual(expect.any(Date));
          });
      });
  });
  test("GET 204: responds with 'No comments found for this article!' for a valid article_id with no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .set("Accept", "application/json")
      .expect(204)
      .then(({ res }) => {
        expect(res.statusMessage).toBe("No comments found for this article!");
      });
  });
  test("GET 404: responds with not found if article_id has not been found", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Requested information not found!");
      });
  });
  test("GET 400: responds with 'Invalid request...' when article id entered in wrong format", () => {
    return request(app)
      .get("/api/articles/wrong_format/comments")
      .expect(400)
      .then(({ res }) => {
        expect(res.statusMessage).toBe('Invalid request: not a valid integer entered!');
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201: adds a new comment to the database and responds with posted comment", () => {  return request(app)
      .post("/api/articles/1/comments/")
      .send({
        body: 'New comment to post',
        username: 'icellusedkars'
      },)
      .expect(201)
      .then(({ body }) => {
        expect(body.postedComment).toEqual({
          comment_id: expect.any(Number),
          body: 'New comment to post',
          article_id: 1,
                   author: 'icellusedkars',
          votes: 0,
          created_at: body.postedComment.created_at
        })
        });
  });
  test("POST 404: responds with 'Bad Request! ...' if article_id has not been found", () => { 
     return request(app)
      .post("/api/articles/500/comments")
      .send({
        body: 'New comment to post',
        username: 'icellusedkars'
      },)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request! There is no such article id!');
      });
  });
   test("POST 400: responds with 'Invalid request...' when article id entered in wrong format", () => {
    return request(app)
      .post("/api/articles/wrong_format/comments")
      .send({
        body: 'New comment to post',
        username: 'icellusedkars'
      },)
      .expect(400)
      .then(({ res }) => {
        expect(res.statusMessage).toBe('Invalid request: not a valid integer entered!');
             });
  });
  test("POST 404: responds with 'Bad Request!...' when article id entered in wrong format", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: 'New comment to post',
        username: 'does_not_exist'
      },)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request! There is no such username!');
             });
  });
});

describe("PATCH /api/articles/:article_id/", () => {
  test("PATCH 200: should update an an article's votes and responds with the updated article", () => {
    let initialVotes;
  return request(app)
    .get("/api/articles/2")
    .expect(200)
    .then(({ body }) => {
      initialVotes = body.article.votes;
    })
    .then(() => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 25 })
        .expect(200);
    })
    .then(({ body }) => {
      expect(body.updatedArticle).toEqual({
        article_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: expect.any(String),
        created_at: expect.any(String),
        votes: initialVotes + 25,
        article_img_url: expect.any(String),
      });
    });
  });
  test("PATCH 404: responds with 'Bad Request! ...' if article_id has not been found", () => {
    return request(app)
      .patch("/api/articles/1000")
      .send({ inc_votes: 25 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request! There is no such article id!');
      });
  });
  test("PATCH 400: responds with 'Invalid request...' when article id entered in wrong format", () => {
    return request(app)
      .patch("/api/articles/wrong_format")
      .send({ inc_votes: 25 })
      .expect(400)
      .then(({ res }) => {
        expect(res.statusMessage).toBe('Invalid request: not a valid integer entered!');
      });
  });
  test("PATCH 400: responds with 'Invalid request...' when the votes parameter is in the wrong format", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: "twenty-five" })
      .expect(400)
      .then(({ res }) => {
        expect(res.statusMessage).toBe("Invalid request: not a valid integer entered!");
      });
  });
  test("PATCH 400: responds with 'Invalid request...' when the inc_votes property is missing", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({})
      .expect(400)
      .then(({ res }) => {
        expect(res.statusMessage).toBe("Invalid request: not a valid integer entered!");
      });
  });
})

describe("GET /api/articles/:article_id  (including comment_count - expanding the original functionality)", () => {
  test("GET 200: responds with article object, which should have comment count property", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 2,
          title: 'Sony Vaio; or, The Laptop',
          topic: 'mitch',
          author: 'icellusedkars',
          body: expect.any(String),
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
        expect(body.article.comment_count).toBe(1);
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE 204: deletes a comment and responds with no content", () => {
    let testedCommentCount;
    let commentId;
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
          testedCommentCount = body.article.comment_count;
        })
      .then(() => {
        return request(app)
          .post("/api/articles/1/comments/")
          .send({
            body: 'New comment to post',
            username: 'icellusedkars'
          },)
          .expect(201)
          .then(({ body }) => {
              commentId = body.postedComment.comment_id
            })
      })
      .then(() => {
        return request(app)
          .delete(`/api/comments/${commentId}`)
          .expect(204);
      })
      .then(() => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)})
      .then(({ body }) => {
        expect(body.article.comment_count).toBe(testedCommentCount);
      });
  });
  test("DELETE 404: responds with error when comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/500")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Requested information not found!");
      });
  });
  test("DELETE 400: responds with 'Bad Request!...' when comment_id entered in wrong format", () => {
    return request(app)
      .delete("/api/comments/wrong_format")
      .expect(400)
      .then(({ res }) => {
        expect(res.statusMessage).toBe(
          "Invalid request: not a valid integer entered!"
        );
      });
  });
});

describe("GET /api/articles?queries", () => {
  test("GET 200: array of article objects filtered by topic and sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(11);
        expect(articles[0].topic).toEqual("mitch");
        expect(articles).toBeSorted({ key: articles.created_at })
      });
  });
  test("GET 200: array of article objects sorted by a specified column and in the specified order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        expect(articles).toBeSorted({ key: articles.votes, descending: false })
      });
  });
  test("GET 200: array of article objects filtered by topic, sorted by a specified column, and in the specified order", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(11);
        expect(articles[0].topic).toEqual("mitch");
        expect(articles).toBeSorted({ key: articles.votes, descending: false })
      });
  });
  test("GET 400: sort_by query is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=bananas")
      .expect(400)
      .then(({ res }) => {
        expect(res.statusMessage).toEqual("Invalid sort_by query parameter! Please check and try again.");
      });
  });

  test("GET 400: order query is invalid", () => {
    return request(app)
      .get("/api/articles?order=asc&desc")
      .expect(400)
      .then(({ res }) => {
        expect(res.statusMessage).toEqual("Invalid sort_by query parameter! Please check and try again.");
      });
  });

  test("GET 204: responds with error when there is no article connected with queried topic ", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(204)
      .then(({ res }) => {
        expect(res.statusMessage).toBe('No article with slug: paper');
      });
  });
  test("GET 404: responds with error when there is no queried topic name in database ", () => {
    return request(app)
      .get("/api/articles?topic=no_name")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Requested information not found!');
      });
  });
});

describe("GET /api/users", () => {
  test("GET 200: responds with an array of users objects, each of which should have the following properties: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          });
          expect(user.avatar_url).toMatch(/^https/);
        });
      });
  });
});


