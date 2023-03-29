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
        expect(body.article).toEqual({
          article_id: 2,
          title: 'Sony Vaio; or, The Laptop',
          topic: 'mitch',
          author: 'icellusedkars',
          body: expect.any(String),
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          article_img_url: expect.any(String),
        })
        expect(body.article.body).toMatch(/^Call me Mitchell/);
        expect(body.article.article_img_url).toMatch(/^https/)
      })
  });
  test("GET 404: responds with error when article with queried id does not exist ", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ res }) => {
        expect(res.statusMessage).toBe('Requested information not found!');
      });
  });
  test("GET 400: responds with 'Bad article_id!' when article id entered in wrong format", () => {
    return request(app)
      .get("/api/articles/abc")
      .expect(400)
      .then(({ res }) => {
        expect(res.statusMessage).toBe('Bad article_id!');
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
        const articlesCopy = [...articles];
        const sortedArticles = articlesCopy.sort((articleA, articleB) => {
          return articleA.created_at - articleB.created_at
        });
        expect(articles).toEqual(sortedArticles);
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
        console.log(body)
        const { comments } = body;
        console.log(comments)
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);
        const commentsCopy = [...comments];
        const sortedComments = commentsCopy.sort((commentA, commentB) => {
          return commentA.created_at - commentB.created_at
        });
        expect(comments).toEqual(sortedComments);
        sortedComments.forEach((comment) => {
          expect(comment).toHaveProperty('comment_id', expect.any(Number));
          expect(comment).toHaveProperty('body', expect.any(String));
          expect(comment).toHaveProperty('votes', expect.any(Number));
          expect(comment).toHaveProperty('author', expect.any(String));
          expect(comment).toHaveProperty('article_id', expect.any(Number));
          expect(comment).toHaveProperty('created_at')
          expect(new Date(comment.created_at)).toEqual(expect.any(Date));
          expect(comment).toHaveProperty('votes', expect.any(Number));
          });
      });
  });
  test("GET 204: responds with 'No comments found for this article!' for a valid article_id with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(204)
      .then(({ res }) => {
        console.log(res.statusMessage)
        expect(res.statusMessage).toBe("No comments found for this article!");
      });
  });
  test("GET 404: responds with not found if article_id has not been found", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ res }) => {
        console.log(res.statusMessage)
        expect(res.statusMessage).toBe("Requested information not found!");
      });
  });
  test("GET 400: responds with 'Bad article_id!' when article id entered in wrong format", () => {
    return request(app)
      .get("/api/articles/abc/comments")
      .expect(400)
      .then(({ res }) => {
        expect(res.statusMessage).toBe('Bad article_id!');
      });
  });
});

