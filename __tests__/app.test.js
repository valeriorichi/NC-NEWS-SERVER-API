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
            expect(body.msg).toBe('Sorry we can’t find that page! Don’t worry, though everything is STILL AWESOME!');
          });
    }); 
});


