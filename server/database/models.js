const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');


const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { error: 'Category must have a name!' },
      notEmpty: { error: 'name must not be empty!' },
      len: [1, 50]
    }
  }, quality: {
    type: DataTypes.ENUM('I', 'II','Bio','Premium','Deluxe'),
    allowNull: false
  }
})

const Aliment = sequelize.define('Aliment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: { error: 'Must be a valid date!' },
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { error: 'Aliment must have a name!' },
      notEmpty: { error: 'name must not be empty!' },
      len: [5, 50]
    }
  },weight:{
    type: DataTypes.NUMBER,
    allowNull: false,
    validate: {
     min: 0
    }
  },
  image: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  measure: {
    type: DataTypes.ENUM('grams', 'kilograms','mililiters','liters','pieces'),
    allowNull: false
  },
  available:{
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = {  Category, Aliment };


