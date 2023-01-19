const { Category } = require("../database/models");
const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");

// get Categorys with or without filtering two attributes/sorting by an attribute, desc or asc
// with pagination or not
app.get('/', async (req, res, next) => {
  try {
    const query = {}
    let pageSize = 2;
    const allowedFilters = ['quality', 'name'];
    const filterKeys = Object.keys(req.query).filter(e => allowedFilters.indexOf(e) !== -1)
    if (filterKeys.length > 0) {
      query.where = {}
      for (const key of filterKeys) {
        query.where[key] = {
          [Op.like]: `%${req.query[key]}%`
        }
      }
    } if (req.query.sortOrder && req.query.sortOrder === '-1') {
      sortOrder = 'DESC'
    }

    if (req.query.pageSize) {
      pageSize = parseInt(req.query.pageSize)
    }
    if (req.query.sort) {
      query.order =  [[Sequelize.fn('lower', Sequelize.col(req.query.sort)), req.query.how ? req.query.how : 'ASC']]
    }
    if (!isNaN(parseInt(req.query.page))) {
      query.limit = pageSize
      query.offset = pageSize * parseInt(req.query.page)
    }
    const records = await Category.findAndCountAll(query);
        res.status(200).json(records);
  } catch (err) {
    console.log(err.message + ' '+req)
    next(err);
  }
});
// post Category
app.post("/", async (req, res, next) => {
  try {
    if (req.body.quality && req.body.name) {
      await Category.create(req.body);
      res.status(201).json({ message: "Category Created!" });
    } else {
      res.status(400).json({ message: "Missing attributes!" });
    }
  } catch (err) {
    next(err);
  }
});
// get Category by id
app.get('/:CategoryId', async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.CategoryId);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Category not found!" });
    }
  } catch (err) {
    next(err);
  }
});

// delete Category by id
app.delete("/:CategoryId", async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.CategoryId);
    if (category) {
      const Aliments = await category.getAliments();
      if (Aliments && Aliments.length > 0) {
        for (let mem of Aliments) {
          await mem.destroy();
        }
      }
      await category.destroy();
      res.status(202).json({ message: "Category is gone :(" });
    } else {
      res.status(404).json({ message: "Category not found!" });
    }
  } catch (err) {
    next(err);
  }
});
module.exports = app;