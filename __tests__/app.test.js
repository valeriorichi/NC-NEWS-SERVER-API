const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/');
const connection = require('../db/connection');

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
    test("GET 400: responds with error and message when a route does not exist,", () => {
        return request(app)
          .get("/api/somethingElse")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid path entered. Please check your URL and try again.');
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
  test("GET 400: responds with error when article id entered in wring format", () => {
    return request(app)
      .get("/api/articles/abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad article_id!');
      });
  });
});


