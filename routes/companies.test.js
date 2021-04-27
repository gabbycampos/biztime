process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany;
beforeEach(async () => {
    let result = await db.query(`INSERT INTO companies (code, name, description) VALUES ('leica', 'camera', 'photo and video') RETURNING code, name, description`);
    testCompany = result.rows[0]
});


describe("GET /companies", () => {
    test("Get a list with one company", async () => {
        const res = await request(app).get('/companies')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ companies: [testCompany] })
    })
});

describe("GET /companies/:code", () => {
    test("Get a single company", async function() {
        const response = await request(app).get(`/companies/${testCompany.code}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({company: testCompany});
    });
    test("Responds with 404 if can't find code", async () => {
        const response = await request(app).get('/companies/blah');
        expect(response.statusCode).toEqual(404);
    });
});

describe("POST /", () => {
    test("Creates a new company", async function() {
        const response = await request(app).post(`/companies`).send({ code: "projector", name: "projector", description: "movies"});
        expect(response.body).toEqual({
            "company": {
                code: "projector",
                name: "projector",
                description: "movies",
            }
        });
    });
});

describe("PUT /", function () {
    test("It should update company", async function () {
      const response = await request(app)
          .put("/companies/leica")
          .send({name: "leicaEdit", description: "NewDescrip"});
      expect(response.body).toEqual(
          {
            "company": {
              code: "leica",
              name: "leicaEdit",
              description: "NewDescrip",
            }
          }
      );
    });
});

describe("DELETE /", function () {
    test("It should delete company", async function () {
      const response = await request(app).delete("/companies/leica");
      expect(response.body).toEqual({"msg": "DELETED"});
    });
});


afterEach(async () => {
    await db.query(`DELETE FROM companies`)
});

afterAll(async () => {
    await db.end()
});