const Sequelize = require("sequelize")
const { db } = require("../config/db")

module.exports = db.define("users", {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dob: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

