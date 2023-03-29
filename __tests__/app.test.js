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
      .then(({ body }) => {
        expect(body.msg).toBe('Requested information not found!');
      });
  });
  test("GET 400: responds with error when article id entered in wrong format", () => {
    return request(app)
      .get("/api/articles/abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad article_id!');
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

