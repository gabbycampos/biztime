const express = require("express");
const ExpressError = require("../expressError");
let router = new express.Router();
const db = require("../db");
const slugify = require("slugify");

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({ companies: results.rows })
    } catch(e) {
        return next(e);
    }
});

router.get('/:code', async (req, res, next) => {
    try {
      const companies = await db.query(
        `
          SELECT c.code, c.name, c.description, i.industry FROM companies AS c
          LEFT JOIN industries_companies AS ic
          ON c.code = ic.comp_code
          LEFT JOIN industries AS i ON i.code = ic.industry_code
          WHERE c.code = $1`,
        [req.params.code]
      );
      if (companies.rows.length === 0) {
        throw new ExpressError(
          `Cannot find company with code ${req.params.code}`,
          404
        );
      }
      return res.json(companies.rows);
    } catch (err) {
      next(err);
    }
  });

router.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const code = slugify(name, {lower: ture});
        
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
        return res.status(201).json({ company: results.rows[0] })
    } catch(e) {
        return next(e)
    }
});

router.put('/:code', async (req, res, next) => {
    try {
        let { name, description } = req.body;
        let { code } = req.params;

        const result = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code= $3 RETURNING code, name, description`, [name, description, code]);
        if (result.rows.length === 0) {
            throw new ExpressError(`Can't update company with code of ${code}`, 404)
        }
        return res.json({ "company": result.rows[0] })
    } catch(e) {
        return next(e)
    }
});

router.delete('/:code', async (req, res, next) => {
    try {
        const results = db.query('DELETE FROM companies WHERE code = $1', [req.params.code])
        return res.send({ msg: "DELETED" })
    } catch (e) {
        return next(e)
    }
});

module.exports = router;