const express = require('express');
const slugify = require('slugify');
const ExpressError = require('../expressError');
let router = new express.Router();
const db = require('../db');

// ADD INDUSTRY
router.post('/', async (req, res, next) => {
    try {
      const { industry } = req.body;
      const code = slugify(industry, { lower: true });
  
      const result = await db.query(`INSERT INTO industries (code,industry) 
                                    VALUES ($1,$2) 
                                    RETURNING code,industry`, [code, industry]);
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      return next(err);
    }
});

// LIST INDUSTRIES
router.get('/:code', async (req, res, next) => {
  try {
    const industries = await db.query(`
      SELECT i.code, i.industry, c.code FROM industries AS i
      LEFT JOIN industries_companies AS ic
      ON i.code = ic.industry_code
      LEFT JOIN companies AS c ON c.code = ic.comp_code`);
      return res.json(industries.rows);
  } catch(e) {
    return next(e);
  }
});


// ADD INDUSTRY TO COMPANY

module.exports = router;