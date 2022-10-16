const Sequelize = require("sequelize")
const { db } = require("../config/db")

module.exports = db.define("comments", {
    body: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

