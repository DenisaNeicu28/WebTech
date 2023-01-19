const { Aliment, Category } = require("../database/models");
const express = require('express');
const { Op } = require("sequelize");
const app = express();
const moment = require('moment');

//gets all Aliments of a certain Category
app.get('/categories/:CategoryId', async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.CategoryId);
    if (category) {
      const Aliments = await category.getAliments();
      if (Aliments && Aliments.length > 0) {
        res.json(Aliments);
      }
      else res.json([]);
    } else res.status(404).json({ message: "No such Category." });
  } catch (err) {
    next(err);
  }
});
// get expiring aliments
app.get('/expiring', async (req, res, next) => {
  try {
    const Aliments = await Aliment.findAll({
      where: {
        expirationDate: {
          [Op.lte]: moment().add(7, 'days').toDate()
        }
      }
    })
    if (Aliments && Aliments.length > 0) {
      res.json(Aliments);
    }
    else res.json([]);
  } catch (err) {
    next(err);
  }
});
// post Aliment to a certain Category
app.post('/categories/:CategoryId', async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.CategoryId);
    if (!category) res.status(404).json({ message: "No such Category." });
    if (req.body.weight && req.body.name && req.body.expirationDate && req.body.image && req.body.measure) {
      const obj = await Aliment.create(req.body);
      category.addAliment(obj);
      await category.save();
      res.status(201).json({ message: "Aliment Created!" });
    } else {
      res.status(400).json({ error: "Malformed request!" });
    }
  } catch (err) {
    next(err);
  }
});
// get Aliment by id
app.get('/:AlimentId/categories/:CategoryId', async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.CategoryId);
    if (!category) res.status(404).json({ message: "No such Category." });
    const aliment = await Aliment.findByPk(req.params.AlimentId);
    if (!aliment) res.status(404).json({ message: "No such Aliment." });
    const found = await Aliment.findOne({ where: { CategoryId: req.params.CategoryId, id: req.params.AlimentId } })
    if (found) res.json(found);
    else res.status(404).json({ message: `Aliment ${req.params.AlimentId} doesn't belong to Category ${req.params.CategoryId}` });
  } catch (err) {
    next(err);
  }
});

// delete Aliment by id
app.delete('/:AlimentId/categories/:CategoryId', async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.CategoryId);
    if (!category) res.status(404).json({ message: "No such Category." });
    const aliment = await Aliment.findByPk(req.params.AlimentId);
    if (!aliment) res.status(404).json({ message: "No such Aliment." });
    const found = await Aliment.findOne({ where: { CategoryId: req.params.CategoryId } })
    if (found) {
      await found.destroy();
      res.status(202).json({ message: "Aliment deleted" });
    }
    else res.status(404).json({ message: `Aliment ${req.params.AlimentId} doesn't belong to Category ${req.params.CategoryId}` });
  } catch (err) {
    next(err);
  }
});

// optional:
// get all existent Aliments
app.get('/', async (req, res, next) => {
  try {
    const Aliments = await Aliment.findAll();
    res.status(200).json(Aliments);
  } catch (err) {
    next(err);
  }
});
module.exports = app;