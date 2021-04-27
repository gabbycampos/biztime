const express = require('express');
const slugify = require('slugify');
const ExpressError = require('../expressError');
let router = new express.Router();
const db = require('../db');

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

module.exports = router;