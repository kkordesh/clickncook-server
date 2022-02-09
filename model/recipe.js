

const { DataTypes } = require('sequelize');
const db = require('../db');

const Recipe = db.define('recipe', {
    nameOfRecipe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    directions: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timeToCook: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    servings: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING(1000),
        allowNull: true 
    }
})

module.exports = Recipe;
