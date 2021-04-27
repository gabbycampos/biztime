process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testInvoice;
beforeEach(async () => {
    let result = await db.query(`INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) 
                                VALUES ('leica', 100, false, '2021-01-01', null) 
                                RETURNING comp_code, amt, paid, add_date, paid_date`);
    testInvoice = result.rows[0]
});

describe("GET /invoices", function() {
    test("Gets a list of once invoice", async function() {
        const response = await request(app).get('/invoices');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            invoices: [testInvoice]
        });
    });
});

afterEach(async () => {
    await db.query(`DELETE FROM invoices`)
});

afterAll(async () => {
    await db.end()
});