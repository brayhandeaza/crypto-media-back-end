const Sequelize = require("sequelize")
const { db } = require("../config/db")

module.exports = db.define("share", {
    uuid: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

