const Sequelize = require("sequelize")
const { db } = require("../config/db")

module.exports = db.define("posts", {
    body: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    uuid: {
        type: Sequelize.STRING,
        allowNull: true
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    privacy: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

