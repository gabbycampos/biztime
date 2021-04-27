process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany;
beforeEach(async () => {
    const result = await db.query(`INSERT INTO companies (name, description) VALUES ('Leica', 'camera') RETURNING id, name, description`);
    testCompany = result.rows[0]
});


describe("GET /companies", () => {
    test("Get a list with one company", async () => {
        const res = await request(app).get('./companies')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ companies: [testCompany] })
    })
});


afterEach(async () => {
    await db.query(`DELETE FROM companies`)
});

afterAll(async () => {
    await db.end()
});