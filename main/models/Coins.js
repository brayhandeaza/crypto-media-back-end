const Sequelize = require("sequelize")
const { db } = require("../config/db")

module.exports = db.define("coins", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    symbol: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    explorer: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

