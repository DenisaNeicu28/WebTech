const express = require('express');
const cors = require("cors");
const path= require('path')
const sequelize = require('./database/sequelize');
const port = process.env.PORT || 3000;
const { Category, Aliment} = require('./database/models');
const categories = require('./routes/categoriesRoutes');
const aliments = require('./routes/alimentsRoutes');

const server = express();
server.use(express.urlencoded({ extended: true, }) );
server.use(express.json());
server.use(cors({ origin: 'http://localhost:3001' }));
server.listen(port, function() {
    console.log("Listening on port " + port + "...");
});

Category.hasMany(Aliment);
Aliment.belongsTo(Category);

server.get("/create", async (req, res, next) => {
    try {
      await sequelize.sync({ force: true });
      res.status(201).json({ message: "Database created." });
    } catch (err) {
      next(err);
    }
});

server.use('/categories',categories);
server.use('/aliments',aliments);